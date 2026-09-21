import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { Window, type HTMLAnchorElement } from 'happy-dom';
import { loadStats, statsFor } from '../src/lib/stats';
import { loadPublishedCatalog as loadCatalog, getPublishedSlugs, packagePath, publishedRoutes, resolvePublishedResource, routePath, type RouteKind } from '../src/lib/published-routes';


describe('generated static pages', () => {
  for (const [locale, path] of [['en', '../dist/index.html'], ['zh', '../dist/zh/index.html']] as const) {
    test(`${locale} includes exactly one analytics tracker for its page route`, () => {
      const win = new Window();
      try {
        win.document.write(readFileSync(new URL(path, import.meta.url), 'utf8'));
        const trackers = win.document.querySelectorAll('vercel-analytics');
        expect(trackers).toHaveLength(1);
        expect(trackers[0]?.getAttribute('data-pathname')).toBe(locale === 'zh' ? '/zh/' : '/');
      } finally {
        win.happyDOM.abort();
      }
    });

    test(`${locale} contains the full directory and accessible controls before JavaScript runs`, () => {
      const html = readFileSync(new URL(path, import.meta.url), 'utf8');
      const win = new Window();
      win.document.write(html);
      expect(win.document.documentElement.lang).toBe(locale === 'zh' ? 'zh-CN' : 'en');
      expect(win.document.title).toContain('Pi Index');
      expect(win.document.querySelectorAll('h1')).toHaveLength(1);
      expect(win.document.querySelector('meta[name="description"]')?.getAttribute('content')?.length).toBeGreaterThan(30);
      const canonical = win.document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      expect(canonical).toBe(`https://piindex.dev/${locale === 'zh' ? 'zh/' : ''}`);
      const socialImage = 'https://piindex.dev/og-image-v4.png';
      expect(win.document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(socialImage);
      const image = readFileSync(new URL('../dist/og-image-v4.png', import.meta.url));
      expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(win.document.querySelector('meta[property="og:image:width"]')?.getAttribute('content')).toBe(String(image.readUInt32BE(16)));
      expect(win.document.querySelector('meta[property="og:image:height"]')?.getAttribute('content')).toBe(String(image.readUInt32BE(20)));
      expect(win.document.querySelector('meta[property="og:image:type"]')?.getAttribute('content')).toBe('image/png');
      expect(win.document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toContain('Pi Index');
      expect(win.document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image');
      expect(win.document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(socialImage);
      for (const link of win.document.querySelectorAll('link[rel="alternate"]')) expect(link.getAttribute('href')).toStartWith('https://');
      const ldJsonScript = win.document.querySelector('script[type="application/ld+json"]');
      expect(ldJsonScript).not.toBeNull();
      const ldJson = JSON.parse(ldJsonScript!.textContent || '{}');
      expect(ldJson['@context']).toBe('https://schema.org');
      expect(Array.isArray(ldJson['@graph'])).toBe(true);
      const websiteEntity = ldJson['@graph'].find((item: { '@type': string }) => item['@type'] === 'WebSite');
      expect(websiteEntity).toBeDefined();
      expect(websiteEntity.url).toBe('https://piindex.dev/');
      const pageEntity = ldJson['@graph'].find((item: { '@type': string }) => item['@type'] === 'CollectionPage');
      expect(pageEntity).toBeDefined();
      expect(pageEntity.url).toBe(canonical);
      expect(pageEntity.inLanguage).toBe(locale === 'zh' ? 'zh-CN' : 'en');
      expect(win.document.querySelector('label[for="search"]')).not.toBeNull();
      expect(win.document.querySelector('label[for="mobile-category"]')).not.toBeNull();
      expect(win.document.querySelector('[data-language]')?.getAttribute('href')).toBe(locale === 'en' ? '/zh/' : '/');
      expect(win.document.querySelector('.github-link')?.getAttribute('aria-label')).toBe('GitHub');
      expect(win.document.querySelector('footer a[href="https://github.com/BubblePtr/awesome-pi/issues/new"]')).not.toBeNull();
      const catalog = loadCatalog();
      const stats = loadStats();
      expect(win.document.querySelectorAll('[data-resource]').length).toBe(catalog.resources.length);
      for (const resource of catalog.resources) {
        const row = win.document.getElementById(resource.id)!;
        expect(row).not.toBeNull();
        expect(row.querySelector<HTMLAnchorElement>('h3 a')?.getAttribute('href')).toBe(packagePath(resource, locale) ?? resource.url);
        expect(row.querySelector('[data-copy]')?.getAttribute('data-copy') ?? null).toBe(resource.install);
        for (const description of resource.descriptions[locale]) expect(row.textContent).toContain(description);
        const metrics = statsFor(resource, stats);
        expect(row.getAttribute('data-stars')).toBe(metrics.stars === null ? null : String(metrics.stars));
        expect(row.getAttribute('data-downloads')).toBe(metrics.weekly === null ? null : String(metrics.weekly));
        expect(row.querySelector('.resource-stats') !== null).toBe(metrics.stars !== null || metrics.weekly !== null);
      }
      expect(win.document.querySelectorAll('.resource-stats').length).toBeGreaterThan(0);
      expect(win.document.querySelector('.stats-updated')).not.toBeNull();
      win.happyDOM.abort();
    });
  }
});

describe('published editorial pages', () => {
  const kinds: RouteKind[] = ['packages', 'categories', 'topics'];
  for (const kind of kinds) for (const slug of getPublishedSlugs(kind)) for (const locale of ['en', 'zh'] as const) {
    const path = routePath(kind, slug, locale);
    test(`${path} is an indexable translated page with working conversion controls`, () => {
      const win = new Window();
      try {
        const html = readFileSync(new URL(`../dist${path}index.html`, import.meta.url), 'utf8');
        win.document.write(html);
        expect(win.document.querySelectorAll('h1')).toHaveLength(1);
        expect(win.document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`https://piindex.dev${path}`);
        for (const [lang, targetLocale] of [['en', 'en'], ['zh-CN', 'zh'], ['x-default', 'en']] as const) {
          expect(win.document.querySelector(`link[hreflang="${lang}"]`)?.getAttribute('href')).toBe(`https://piindex.dev${routePath(kind, slug, targetLocale)}`);
        }
        expect(win.document.querySelector('[data-language]')?.getAttribute('href')).toBe(routePath(kind, slug, locale === 'en' ? 'zh' : 'en'));
        expect(win.document.querySelectorAll('vercel-analytics')).toHaveLength(1);
        expect(win.document.querySelector('vercel-analytics')?.getAttribute('data-pathname')).toBe(path);
        expect(win.document.querySelector('[data-interactions]')?.getAttribute('data-surface')).toBe(kind === 'packages' ? 'detail' : kind === 'topics' ? 'topic' : 'category');
        expect(win.document.querySelectorAll('[data-repo-link]').length).toBeGreaterThan(0);
        expect(win.document.querySelectorAll('[data-copy][data-package]').length).toBeGreaterThan(0);
        if (kind === 'topics') {
          expect(win.document.title).toContain('TypeSafe AI');
          expect(win.document.title).toContain('Jev');
        }
        for (const button of win.document.querySelectorAll('[data-copy][data-package]')) {
          const catalog = loadCatalog();
          const name = button.getAttribute('data-package');
          const resource = catalog.resources.find(resource => resource.name === name)
            ?? getPublishedSlugs('packages').map(slug => resolvePublishedResource(slug, catalog)).find(resource => resource?.name === name);
          expect(resource).toBeDefined();
          expect(button.getAttribute('data-copy')).toBe(resource!.install);
        }
      } finally { win.happyDOM.abort(); }
    });
  }

  test.each(['en', 'zh'] as const)('%s directory exposes published guides independently from filtering', locale => {
    const win = new Window();
    try {
      win.document.write(readFileSync(new URL(`../dist/${locale === 'zh' ? 'zh/' : ''}index.html`, import.meta.url), 'utf8'));
      for (const slug of getPublishedSlugs('topics')) expect(win.document.querySelector(`.topic-link[href="${routePath('topics', slug, locale)}"]`)).not.toBeNull();
      if (publishedRoutes.packages['pi-mcp-adapter']?.status === 'active') expect(win.document.querySelector(`.package-link[href="${routePath('packages', 'pi-mcp-adapter', locale)}"]`)).not.toBeNull();
      for (const slug of getPublishedSlugs('categories')) expect(win.document.querySelector(`.guide-link[href="${routePath('categories', slug, locale)}"]`)).not.toBeNull();
      expect(win.document.querySelectorAll('.guide-link[data-category], .package-link[data-category], .topic-link[data-category]')).toHaveLength(0);
      for (const resource of loadCatalog().resources) {
        const row = win.document.getElementById(resource.id)!;
        const path = packagePath(resource, locale);
        expect(row.querySelector('h3 a')?.getAttribute('href')).toBe(path ?? resource.url);
        const repoLink = row.querySelector<HTMLAnchorElement>('[data-repo-link]');
        if (['github.com', 'www.npmjs.com', 'npmjs.com'].includes(new URL(resource.url).hostname)) expect(repoLink?.getAttribute('href')).toBe(resource.url);
      }
    } finally { win.happyDOM.abort(); }
  });

  test('all generated internal links and fragment targets exist', () => {
    const dist = new URL('../dist/', import.meta.url);
    for (const filename of readdirSync(dist, { recursive: true }).filter(file => String(file).endsWith('.html'))) {
      const win = new Window();
      try {
        win.document.write(readFileSync(new URL(String(filename), dist), 'utf8'));
        const current = new URL(String(filename).replace(/index\.html$/, ''), 'https://piindex.dev/');
        for (const anchor of win.document.querySelectorAll('a[href]')) {
          const target = new URL(anchor.getAttribute('href')!, current);
          if (target.origin !== current.origin) continue;
          const pathname = decodeURIComponent(target.pathname);
          const targetFile = new URL(`.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`, dist);
          expect(existsSync(targetFile), `${filename} → ${target.href}`).toBe(true);
          if (target.hash && target.pathname === current.pathname) expect(win.document.getElementById(decodeURIComponent(target.hash.slice(1))), `${filename} → ${target.hash}`).not.toBeNull();
        }
      } finally { win.happyDOM.abort(); }
    }
  });

  test('renamed package URLs have permanent hosting redirects in both languages', () => {
    const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
    for (const [slug, route] of Object.entries(publishedRoutes.packages)) {
      if (route.status !== 'redirected') continue;
      expect(getPublishedSlugs('packages')).toContain(route.redirectTo);
      for (const locale of ['en', 'zh'] as const) expect(config.redirects).toContainEqual({ source: routePath('packages', slug, locale), destination: routePath('packages', route.redirectTo, locale), permanent: true });
    }
  });
});
