import { describe, expect, test } from 'bun:test';
import { createPublishedCatalog, isPublished, packagePath, resolvePublishedResource, type Archive, type PublishedRoutes } from '../src/lib/published-routes';

const archive: Archive = { name: 'test-search', url: 'https://github.com/example/search', install: 'pi install npm:test-search', kind: 'packages', categories: ['web-access-search'], descriptions: { en: ['Search the web.'], zh: ['搜索网页。'] } };
const active = { status: 'active', slug: 'stable-search', canonicalName: archive.name, archive } as const;
const routes: PublishedRoutes = { packages: { 'stable-search': active }, categories: {}, topics: {} };
const source = '## Packages\n### Web Access & Search\n- [test-search](https://github.com/example/search) - Search the web. `pi install npm:test-search`\n';
const empty = { resources: [], categories: [], recordCount: 0 };

describe('published resource lifecycle', () => {
  test('archive recovery does not conceal conflicting live translations', () => {
    const markdown = { en: source, zh: source.replace('https://github.com/example/search', 'https://github.com/another-owner/search') };
    expect(() => { createPublishedCatalog(markdown, routes); }).toThrow(/translation/i);
  });
  test.each(['en', 'zh', 'both'])('archive recovery precedes translation validation when %s source records disappear', missing => {
    const markdown = { en: missing === 'en' || missing === 'both' ? '' : source, zh: missing === 'zh' || missing === 'both' ? '' : source };
    const restored = createPublishedCatalog(markdown, routes).resources[0];
    expect(restored?.install).toBe('pi install npm:test-search');
    expect(restored?.descriptions.en.length).toBeGreaterThan(0);
    expect(restored?.descriptions.zh.length).toBeGreaterThan(0);
  });
  test('an active guide survives removal from the upstream directory', () => {
    const resource = resolvePublishedResource('stable-search', empty, routes);
    expect(resource?.name).toBe('test-search');
    expect(resource?.install).toBe('pi install npm:test-search');
    expect(resource?.descriptions.zh.length).toBeGreaterThan(0);
  });
  test('live catalog updates win without changing a published URL', () => {
    const catalog = createPublishedCatalog({ en: source, zh: source }, routes);
    const resource = catalog.resources[0];
    resource.install = 'pi install npm:test-search@next';
    expect(resolvePublishedResource('stable-search', catalog, routes)?.install).toBe(resource.install);
    expect(packagePath(resource, 'zh', routes)).toBe('/zh/packages/stable-search/');
    expect(isPublished({ name: 'unpublished-tool' }, routes)).toBe(false);
    expect(packagePath({ name: 'unpublished-tool' }, 'en', routes)).toBeUndefined();
  });
  test('deprecated pages retain their archive and redirected names do not render a duplicate page', () => {
    const retiredRoutes: PublishedRoutes = { ...routes, packages: {
      retired: { ...active, slug: 'retired', status: 'deprecated', replacementSlug: 'stable-search', deprecatedReason: { en: 'Retired', zh: '已下架' } },
      previous: { status: 'redirected', redirectTo: 'retired' },
    } };
    const catalog = createPublishedCatalog({ en: source, zh: source }, routes);
    catalog.resources[0].install = 'pi install npm:test-search@next';
    expect(resolvePublishedResource('retired', catalog, retiredRoutes)?.install).toBe('pi install npm:test-search');
    expect(packagePath(catalog.resources[0], 'en', retiredRoutes)).toBeUndefined();
    expect(resolvePublishedResource('previous', catalog, retiredRoutes)).toBeUndefined();
    expect(resolvePublishedResource('unknown', catalog, retiredRoutes)).toBeUndefined();
  });
});
