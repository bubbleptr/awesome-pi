import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { categoryLabel } from '../src/lib/i18n';
import { filterResources } from '../src/lib/filter';
import { loadPublishedCatalog } from '../src/lib/published-routes';
import { buildPublicCatalog, catalogResponse, type PublicCatalog } from '../src/lib/public-catalog';

function comparable(catalog: PublicCatalog) {
  return {
    ...catalog,
    statsGeneratedAt: '',
    packages: catalog.packages.map(({ stars: _stars, weeklyDownloads: _weekly, weeklyTrendPercent: _trend, repoUrl: _repo, ...pkg }) => pkg),
  };
}

describe('public catalog document', () => {
  const catalog = loadPublishedCatalog();
  const doc = buildPublicCatalog();
  const categoryNames = new Map(catalog.categories.map(category => [category.id, category.name]));

  test('keeps one record per directory resource, in directory order', () => {
    expect(doc.schemaVersion).toBe(1);
    expect(doc.site).toBe('https://piindex.dev');
    expect(doc.packages.map(pkg => pkg.id)).toEqual(catalog.resources.map(resource => resource.id));
  });

  test('uses the same search haystack and AND filter as the directory', () => {
    const wrapped = catalog.resources.map(resource => ({
      ...resource,
      searchText: `${resource.searchText} ${resource.categories.map(id => categoryLabel(categoryNames.get(id) ?? id, 'zh')).join(' ')}`,
    }));
    for (const pkg of doc.packages) {
      expect(pkg.searchText).toBe(wrapped.find(resource => resource.id === pkg.id)!.searchText);
    }
    const queries = [
      { q: 'Brave', category: 'all' },
      { q: '子代理', category: 'all' },
      { q: 'web search', category: 'web-access-search' },
      { q: '', category: 'themes' },
      { q: 'mcp', category: 'packages' },
      { q: 'Brave missing', category: 'all' },
    ];
    for (const filters of queries) {
      expect(filterResources(doc.packages, filters).map(pkg => pkg.id)).toEqual(filterResources(wrapped, filters).map(resource => resource.id));
    }
  });

  test('links every package back to piindex.dev and includes a guide only when one is published', () => {
    for (const pkg of doc.packages) {
      expect(pkg.piindexUrl).toStartWith('https://piindex.dev/');
      expect(pkg.directoryUrl).toStartWith('https://piindex.dev/');
      for (const guide of pkg.guides) expect(guide.piindexUrl).toStartWith('https://piindex.dev/');
    }
    const web = doc.packages.find(pkg => pkg.name === 'pi-web-access')!;
    expect(web.piindexUrl).toBe('https://piindex.dev/packages/pi-web-access/');
    expect(web.guideUrl).toBe(web.piindexUrl);
    expect(web.install).toBe('pi install npm:pi-web-access');
    expect(web.npmPackage).toBe('pi-web-access');
    expect(web.npmUrl).toBe('https://www.npmjs.com/package/pi-web-access');
    expect(web.repoUrl).toBe('https://github.com/nicobailon/pi-web-access');
    expect(web.projectUrl).toBe('https://github.com/nicobailon/pi-web-access');
    const scoped = doc.packages.find(pkg => pkg.name === '@tintinweb/pi-subagents')!;
    expect(scoped.npmUrl).toBe('https://www.npmjs.com/package/@tintinweb/pi-subagents');
    expect(scoped.directoryUrl).toContain('q=');
    const unguided = doc.packages.find(pkg => pkg.name === 'pi-vetter')!;
    expect(unguided.guideUrl).toBeNull();
    expect(unguided.piindexUrl).toBe(unguided.directoryUrl);
  });

  test('lists categories, kinds, and guides with directory or guide URLs', () => {
    const subagents = doc.categories.find(category => category.id === 'subagents')!;
    expect(subagents).toMatchObject({
      name: 'Subagents', nameZh: '子代理', kind: 'packages',
      piindexUrl: 'https://piindex.dev/?category=subagents',
      guideUrl: 'https://piindex.dev/categories/subagents/',
    });
    expect(subagents.count).toBeGreaterThan(0);
    expect(doc.kinds.find(kind => kind.id === 'distributions')).toMatchObject({
      name: 'Distributions', nameZh: '替代发行版', piindexUrl: 'https://piindex.dev/?category=distributions',
    });
    expect(doc.kinds.find(kind => kind.id === 'community')).toMatchObject({
      name: 'Community Resources', nameZh: '社区资源', count: 1, piindexUrl: 'https://piindex.dev/?category=community',
    });
    expect(doc.categories.find(category => category.id === 'community-resources')).toMatchObject({
      name: 'Community Resources', nameZh: '社区资源', kind: 'community', count: 1,
      piindexUrl: 'https://piindex.dev/?category=community-resources', guideUrl: null,
    });
    expect(doc.packages.find(pkg => pkg.name === 'omp packages')).toMatchObject({
      kind: 'community', kindName: 'Community Resources', kindNameZh: '社区资源',
      install: null, npmPackage: null, projectUrl: 'https://omppackages.com',
      categories: ['community-resources'],
    });
    expect(doc.guides.find(guide => guide.kind === 'topic' && guide.slug === 'jev')).toMatchObject({
      piindexUrl: 'https://piindex.dev/topics/jev/',
    });
    expect(doc.guides.find(guide => guide.slug === 'jev')!.packages).toContain('pi-warden');
    expect(doc.packages.find(pkg => pkg.name === 'pi-warden')!.guides.some(guide => guide.piindexUrl === 'https://piindex.dev/topics/jev/')).toBe(true);
  });

  test('the committed MCP snapshot matches the catalog aside from the stats snapshot', () => {
    const snapshot = JSON.parse(readFileSync(new URL('../../mcp/catalog.snapshot.json', import.meta.url), 'utf8')) as PublicCatalog;
    expect(comparable(snapshot)).toEqual(comparable(doc));
  });

  test('serves the catalog as cacheable JSON', async () => {
    const response = catalogResponse(doc);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Cache-Control')).toContain('max-age=300');
    const body = await response.json() as PublicCatalog;
    expect(body.packages).toHaveLength(doc.packages.length);
    expect(body.packages.find(pkg => pkg.name === 'pi-mcp-adapter')?.piindexUrl).toBe('https://piindex.dev/packages/pi-mcp-adapter/');
  });
});
