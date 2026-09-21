import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { ListItem, PhrasingContent } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

export type Locale = 'en' | 'zh';
export type ResourceKind = 'packages' | 'themes' | 'integrations' | 'distributions';
export type RawRecord = {
  name: string; url: string; description: string; install: string | null;
  category: string; categoryName: string; kind: ResourceKind;
};
export type Resource = {
  id: string; name: string; url: string; install: string | null; kind: ResourceKind;
  categories: string[]; descriptions: Record<Locale, string[]>; searchText: string;
};
export type Category = { id: string; name: string; kind: ResourceKind; count: number };
export type Catalog = { resources: Resource[]; categories: Category[]; recordCount: number };
export type ResourceArchive = Pick<Resource, 'name' | 'url' | 'install' | 'kind' | 'descriptions' | 'categories'>;

const sections: Record<string, ResourceKind> = {
  Packages: 'packages', Themes: 'themes',
  'Editor Integration': 'integrations', 'Alternative Distributions': 'distributions',
};

export function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseItem(item: ListItem, categoryName: string, kind: ResourceKind): RawRecord {
  const paragraph = item.children[0];
  const line = item.position?.start.line;
  if (paragraph?.type !== 'paragraph') throw new Error(`Invalid resource at line ${line}`);
  const nodes = paragraph.children;
  const linkIndex = nodes.findIndex(node => node.type === 'link');
  const link = nodes[linkIndex];
  if (!link || link.type !== 'link') throw new Error(`Resource link missing at line ${line}`);
  const prefix = toString({ type: 'paragraph', children: nodes.slice(0, linkIndex) }).trim();
  if (prefix && prefix !== '🔥') throw new Error(`Unexpected resource prefix at line ${line}`);
  let url: URL;
  try { url = new URL(link.url); } catch { throw new Error(`Invalid resource URL at line ${line}`); }
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`Invalid URL protocol at line ${line}`);
  const name = toString(link).trim();
  const tail = nodes.slice(linkIndex + 1);
  const installNodes = tail.filter(node => node.type === 'inlineCode' && /^(?:pi install |npm install |curl )/.test(node.value));
  if (installNodes.length > 1) throw new Error(`Multiple install commands for ${name}`);
  const command = installNodes[0];
  const descriptionNodes = tail.filter(node => node !== command) as PhrasingContent[];
  const description = toString({ type: 'paragraph', children: descriptionNodes }).replace(/^\s*[-–—]\s*/, '').trim();
  if (!name || !description) throw new Error(`Incomplete resource at line ${line}`);
  return { name, url: link.url, description, install: command?.type === 'inlineCode' ? command.value : null, category: slug(categoryName), categoryName, kind };
}

export function parseReadme(markdown: string): RawRecord[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const records: RawRecord[] = [];
  const seen = new Set<string>();
  let kind: ResourceKind | undefined;
  let categoryName = '';
  for (const node of tree.children) {
    if (node.type === 'heading') {
      const heading = toString(node);
      if (sections[heading] && node.depth <= 3) {
        kind = sections[heading];
        categoryName = ['integrations', 'distributions'].includes(kind) ? heading : '';
      } else if (node.depth <= 2) {
        kind = undefined;
        categoryName = '';
      } else if (node.depth === 3 && kind) categoryName = heading;
    } else if (node.type === 'list' && kind) {
      if (!categoryName) throw new Error(`Resource category missing under ${kind}`);
      for (const item of node.children) {
        const record = parseItem(item, categoryName, kind);
        const key = recordKey(record);
        if (seen.has(key)) throw new Error(`Duplicate resource: ${record.name} in ${categoryName}`);
        seen.add(key);
        records.push(record);
      }
    }
  }
  return records;
}

function identity(record: RawRecord): string { return `${record.name}\0${record.url}`; }
function recordKey(record: RawRecord): string { return `${identity(record)}\0${record.kind}\0${record.category}`; }

export function createCatalog(markdown: Record<Locale, string>, archives: ResourceArchive[] = []): Catalog {
  const en = parseReadme(markdown.en);
  const zh = parseReadme(markdown.zh);
  // Recover only registered resources; unrelated translation errors remain build failures.
  for (const archive of archives) {
    if (en.some(record => record.name === archive.name) && zh.some(record => record.name === archive.name)) continue;
    const live = [...en, ...zh].filter(record => record.name === archive.name);
    const references = live.length ? live : archive.categories.map(category => ({
      name: archive.name, url: archive.url, install: archive.install, kind: archive.kind,
      category, categoryName: [...en, ...zh].find(record => record.category === category)?.categoryName ?? category,
      description: '',
    }));
    for (const [locale, records] of [['en', en], ['zh', zh]] as const) for (const reference of references) {
      if (!records.some(record => recordKey(record) === recordKey(reference))) {
        records.push({ ...reference, description: archive.descriptions[locale].join(' ') });
      }
    }
  }
  if (!en.length || !zh.length) throw new Error('Catalog or translation is empty');
  const translations = new Map(zh.map(record => [recordKey(record), record]));
  const resources = new Map<string, Resource>();
  const categories = new Map<string, Category>();
  for (const record of en) {
    const translated = translations.get(recordKey(record));
    if (!translated) throw new Error(`Chinese translation/category missing for ${record.name} in ${record.categoryName}`);
    translations.delete(recordKey(record));
    if (record.install !== translated.install) throw new Error(`Install command differs between translations for ${record.name}`);
    const key = identity(record);
    let resource = resources.get(key);
    if (!resource) {
      resource = {
        id: `${slug(record.name)}-${createHash('sha256').update(key).digest('hex').slice(0, 8)}`,
        name: record.name, url: record.url, install: record.install, kind: record.kind,
        categories: [], descriptions: { en: [], zh: [] }, searchText: '',
      };
      resources.set(key, resource);
    } else if (resource.install !== record.install || resource.kind !== record.kind) {
      throw new Error(`Conflicting install command or type for ${record.name}`);
    }
    resource.categories.push(record.category);
    if (!resource.descriptions.en.includes(record.description)) resource.descriptions.en.push(record.description);
    if (!resource.descriptions.zh.includes(translated.description)) resource.descriptions.zh.push(translated.description);
    resource.searchText += ` ${record.name} ${record.description} ${translated.description} ${record.categoryName} ${record.kind} ${record.install ?? ''}`;
    if (!categories.has(record.category)) categories.set(record.category, { id: record.category, name: record.categoryName, kind: record.kind, count: 0 });
    categories.get(record.category)!.count++;
  }
  if (translations.size) throw new Error(`English translation missing for ${[...translations.values()][0].name}`);
  return { resources: [...resources.values()], categories: [...categories.values()], recordCount: en.length };
}

export function loadCatalog(archives: ResourceArchive[] = []): Catalog {
  return createCatalog({
    en: readFileSync(new URL('../../../README.en.md', import.meta.url), 'utf8'),
    zh: readFileSync(new URL('../../../README.md', import.meta.url), 'utf8'),
  }, archives);
}
