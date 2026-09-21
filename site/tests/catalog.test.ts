import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { createCatalog, parseReadme } from '../src/lib/catalog';
import { createPublishedCatalog } from '../src/lib/published-routes';
import { filterResources, readFilters, writeFilters } from '../src/lib/filter';

const entry = (name: string, description: string, command = `pi install npm:${name}`) =>
  `- [${name}](https://github.com/example/collection) - ${description}${command ? ` \`${command}\`` : ''}`;
const simple = (description: string) => `## Packages\n### Web Access & Search\n${entry('@test/search', description)}`;

describe('README catalog', () => {
  test('extracts resources without treating the contents or contributing lists as entries', () => {
    const markdown = `## Contents\n- [Packages](#packages)\n${simple('Search with \`/find\`.')}\n## Contributing\n- [Help](https://example.com)`;
    const records = parseReadme(markdown);
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ name: '@test/search', description: 'Search with /find.', install: 'pi install npm:@test/search', category: 'web-access-search', kind: 'packages' });
  });

  test('keeps distinct extensions from the same repository and install target', () => {
    const markdown = `## Packages\n### UI Enhancement\n${entry('notify', 'Notify.', 'pi install git:github.com/example/collection')}\n${entry('whimsical', 'Thinking messages.', 'pi install git:github.com/example/collection')}`;
    const { resources } = createCatalog({ en: markdown, zh: markdown });
    expect(resources).toHaveLength(2);
    expect(new Set(resources.map(resource => resource.id)).size).toBe(2);
  });

  test('merges repeated themes while retaining both variant descriptions and category membership', () => {
    const en = `## Themes\n### Dark Themes\n${entry('theme', 'Dark variant.')}\n### Light Themes\n${entry('theme', 'Light variant.')}`;
    const zh = en.replace('Dark variant.', '深色变体。').replace('Light variant.', '浅色变体。');
    const { resources } = createCatalog({ en, zh });
    expect(resources).toHaveLength(1);
    expect(resources[0].categories).toEqual(['dark-themes', 'light-themes']);
    expect(resources[0].descriptions.en).toEqual(['Dark variant.', 'Light variant.']);
    expect(resources[0].descriptions.zh).toEqual(['深色变体。', '浅色变体。']);
  });

  test('recognizes editor integrations even when the README uses a level-three heading', () => {
    const markdown = `## Themes\n### Dark Themes\n${entry('theme', 'Theme.')}\n### Editor Integration\n${entry('pi-acp', 'Editor.', 'npm install -g pi-acp')}\n## Alternative Distributions\n${entry('fork', 'Standalone.', 'curl -fsSL https://example.com/install | sh')}`;
    expect(parseReadme(markdown).map(record => [record.kind, record.install])).toEqual([
      ['themes', 'pi install npm:theme'], ['integrations', 'npm install -g pi-acp'], ['distributions', 'curl -fsSL https://example.com/install | sh'],
    ]);
  });

  test('supports missing install commands and does not turn other inline code into a command', () => {
    expect(parseReadme(`## Packages\n### Utilities\n${entry('tool', 'Use \`/tool\`.', '')}`)[0]).toMatchObject({ install: null, description: 'Use /tool.' });
  });

  test('matches translations by identity rather than row order', () => {
    const en = `## Packages\n### Utilities\n${entry('one', 'First.')}\n${entry('two', 'Second.')}`;
    const zh = `## Packages\n### Utilities\n${entry('two', '第二个。')}\n${entry('one', '第一个。')}`;
    expect(createCatalog({ en, zh }).resources[0].descriptions.zh).toEqual(['第一个。']);
  });

  test('fails on missing translations, divergent commands, duplicate rows, and malformed resource lines', () => {
    expect(() => createCatalog({ en: simple('English.'), zh: '## Packages' })).toThrow(/translation|empty/i);
    expect(() => createCatalog({ en: simple('English.'), zh: simple('中文。').replace('npm:@test/search', 'npm:wrong') })).toThrow(/install/i);
    expect(() => createCatalog({ en: simple('English.'), zh: simple('中文。').replace('Web Access & Search', 'Utilities') })).toThrow(/translation|categor/i);
    expect(() => parseReadme(`${simple('Description.')}\n${entry('@test/search', 'Duplicate.')}`)).toThrow(/duplicate/i);
    expect(() => parseReadme('## Packages\n### Utilities\n- missing link')).toThrow(/resource/i);
    expect(() => parseReadme('## Packages\n### Utilities\n- [bad](javascript:alert) - Unsafe link.')).toThrow(/URL|protocol/i);
  });

  test('indexes every existing resource, preserves install commands, and separates resource types', () => {
    const en = readFileSync(new URL('../../README.en.md', import.meta.url), 'utf8');
    const zh = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');
    const catalog = createPublishedCatalog({ en, zh });
    expect(catalog.resources.length).toBeGreaterThanOrEqual(new Set(parseReadme(en).map(record => `${record.name}|${record.url}`)).size);
    expect(catalog.resources.some(resource => resource.name === 'pi-vetter')).toBe(true);
    expect(catalog.resources.find(resource => resource.name === 'pi-verdict')?.descriptions.en.join(' ')).toContain('not an OS-level sandbox');
    expect(catalog.resources.find(resource => resource.name === 'pi-acp')?.kind).toBe('integrations');
    expect(catalog.resources.find(resource => resource.name === 'oh-my-pi')?.kind).toBe('distributions');
    for (const resource of catalog.resources) {
      expect(resource.descriptions.en.length).toBeGreaterThan(0);
      expect(resource.descriptions.zh.length).toBeGreaterThan(0);
    }
  });
});

describe('directory search and shareable filters', () => {
  const catalog = () => createCatalog({ en: simple('Search the web with Brave.'), zh: simple('通过 Brave 搜索网页。') });
  test('searches names, both languages, and category labels with case-insensitive AND matching', () => {
    const { resources } = catalog();
    expect(filterResources(resources, { q: 'BRAVE 网页', category: 'all' })).toHaveLength(1);
    expect(filterResources(resources, { q: 'web access', category: 'all' })).toHaveLength(1);
    expect(filterResources(resources, { q: 'Brave missing', category: 'all' })).toHaveLength(0);
    expect(filterResources(resources, { q: '', category: 'themes' })).toHaveLength(0);
  });
  test('combines search and category and supports top-level resource types', () => {
    const { resources } = catalog();
    expect(filterResources(resources, { q: 'search', category: 'web-access-search' })).toHaveLength(1);
    expect(filterResources(resources, { q: '', category: 'packages' })).toHaveLength(1);
    expect(filterResources(resources, { q: '', category: 'utilities' })).toHaveLength(0);
  });
  test('round-trips Unicode and scoped names, ignores invalid categories, and omits defaults', () => {
    const filters = { q: '@scope/search 中文', category: 'web-access-search' };
    expect(readFilters(writeFilters(filters), ['web-access-search'])).toEqual(filters);
    expect(readFilters('?category=unknown&q=%20Pi%20', [])).toEqual({ q: 'Pi', category: 'all' });
    expect(writeFilters({ q: '', category: 'all' })).toBe('');
  });
});
