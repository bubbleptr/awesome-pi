import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { Window, type HTMLAnchorElement, type HTMLInputElement } from 'happy-dom';
import { loadStats, statsFor } from '../src/lib/stats';
import { initializeDirectory } from '../src/scripts/directory';
import { loadPublishedCatalog as loadCatalog, getPublishedSlugs, packagePath, publishedRoutes, resolvePublishedResource, routePath, type RouteKind } from '../src/lib/published-routes';
import { getEditorial } from '../src/lib/editorial';


describe('generated static pages', () => {
  for (const [locale, path] of [['en', '../dist/index.html'], ['zh', '../dist/zh/index.html']] as const) {
    test(`${locale} includes exactly one pageview tracker`, () => {
      const win = new Window();
      try {
        win.document.write(readFileSync(new URL(path, import.meta.url), 'utf8'));
        const trackers = win.document.querySelectorAll('script[data-domain]');
        expect(trackers).toHaveLength(1);
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
        expect(win.document.querySelectorAll('script[data-domain]')).toHaveLength(1);
        expect(win.document.querySelector('[data-interactions]')?.getAttribute('data-surface')).toBe(kind === 'packages' ? 'detail' : kind === 'topics' ? 'topic' : 'category');
        expect(win.document.querySelectorAll('[data-repo-link]').length).toBeGreaterThan(0);
        expect(win.document.querySelectorAll('[data-copy][data-package]').length).toBeGreaterThan(0);
        if (slug === 'jev') {
          expect(win.document.title).toContain('TypeSafe AI');
          expect(win.document.title).toContain('Jev');
        }
        const officialLinks = [...win.document.querySelectorAll<HTMLAnchorElement>('.official-links a[href]')];
        const declared = getEditorial(kind, slug).officialLinks ?? [];
        expect(officialLinks).toHaveLength(declared.length);
        for (const [index, link] of officialLinks.entries()) {
          const href = link.getAttribute('href')!;
          const expected = declared[index].url ?? `${locale === 'zh' ? '/zh' : ''}${declared[index].path}`;
          expect(href).toBe(expected);
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
      for (const slug of getPublishedSlugs('topics')) expect(win.document.querySelector(`.guide-card-link[data-guide="${slug}"]`)?.getAttribute('href')).toBe(routePath('topics', slug, locale));
      if (publishedRoutes.packages['pi-mcp-adapter']?.status === 'active') expect(win.document.querySelector(`.package-link[href="${routePath('packages', 'pi-mcp-adapter', locale)}"]`)).not.toBeNull();
      for (const slug of getPublishedSlugs('categories')) expect(win.document.querySelector(`.guide-link[href="${routePath('categories', slug, locale)}"]`)).not.toBeNull();
      expect(win.document.querySelectorAll('.guide-link[data-category], .package-link[data-category], .topic-link[data-category]')).toHaveLength(0);
      for (const link of win.document.querySelectorAll('.directory-guides a')) {
        const visible = link.cloneNode(true) as HTMLAnchorElement;
        visible.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove());
        const label = visible.textContent.trim();
        expect(link.getAttribute('aria-label') ?? label).toContain(label);
      }
      for (const resource of loadCatalog().resources) {
        const row = win.document.getElementById(resource.id)!;
        const path = packagePath(resource, locale);
        expect(row.querySelector('h3 a')?.getAttribute('href')).toBe(path ?? resource.url);
        const repoLink = row.querySelector<HTMLAnchorElement>('[data-repo-link]');
        if (['github.com', 'www.npmjs.com', 'npmjs.com'].includes(new URL(resource.url).hostname)) expect(repoLink?.getAttribute('href')).toBe(resource.url);
      }
    } finally { win.happyDOM.abort(); }
  });

  test.each(['en', 'zh'] as const)('%s Bento tracks only guide activation and preserves native navigation and filters', locale => {
    const win = new Window({ url: `https://example.com/${locale === 'zh' ? 'zh/' : ''}?q=Brave&category=web-access-search` });
    try {
      win.document.write(readFileSync(new URL(`../dist/${locale === 'zh' ? 'zh/' : ''}index.html`, import.meta.url), 'utf8'));
      const events: Array<{ name: string; props: Record<string, string> }> = [];
      Object.assign(win, { plausible: (name: string, options: { props: Record<string, string> }) => events.push({ name, props: options.props }) });
      initializeDirectory(win.document as unknown as Document, win as unknown as globalThis.Window);
      const section = win.document.querySelector('.directory-guides')!;
      for (const target of section.querySelectorAll('.guide-card, .guide-illustration, .guides-directory-link')) {
        target.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));
        target.dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true }));
      }
      expect(events).toEqual([]);
      const links = section.querySelectorAll<HTMLAnchorElement>('.guide-card-link');
      expect(links.length).toBeGreaterThan(0);
      for (const [index, link] of links.entries()) {
        const href = link.getAttribute('href')!;
        link.dispatchEvent(new win.MouseEvent('auxclick', { bubbles: true, button: 2 }));
        expect(events).toHaveLength(index);
        const event = new win.MouseEvent(index === 2 ? 'auxclick' : 'click', { bubbles: true, cancelable: true, metaKey: index === 1, button: index === 2 ? 1 : 0 });
        link.querySelector('span')!.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
        expect(link.getAttribute('href')).toBe(href);
        expect(events).toHaveLength(index + 1);
        expect(events[index]).toEqual({ name: 'guide_clicked', props: { guide: href.split('/').filter(Boolean).at(-1)!, locale, placement: 'home_bento' } });
      }
      expect(win.document.querySelector<HTMLInputElement>('#search')!.value).toBe('Brave');
      expect(win.document.querySelector('[data-category="web-access-search"]')!.getAttribute('aria-current')).toBe('true');
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

describe('conversation pages', () => {
  const slugs = ['pi-durable', 'changing-models', 'agent-frustrations', 'slippery-slop', 'harness-and-workflow'];
  // happy-dom would otherwise fetch the YouTube embed page over the network and keep
  // loading its stylesheets after abort(), failing the run with errors between tests.
  const offline = { settings: { disableIframePageLoading: true } };
  for (const locale of ['en', 'zh']) {
    const base = locale === 'zh' ? '/zh/talks/' : '/talks/';
    test(`${base} lists all five conversations`, () => {
      const win = new Window();
      try {
        win.document.write(readFileSync(new URL(`../dist${base}index.html`, import.meta.url), 'utf8'));
        expect(win.document.querySelectorAll('.talk-card')).toHaveLength(5);
        for (const slug of slugs) expect(win.document.querySelector(`a[href="${base}${slug}/"]`)).not.toBeNull();
      } finally { win.happyDOM.abort(); }
    });
    test(`${base} pages suppress the Referer header so twimg videos play`, () => {
      for (const path of [base, ...slugs.map(slug => `${base}${slug}/`)]) {
        const win = new Window(offline);
        try {
          win.document.write(readFileSync(new URL(`../dist${path}index.html`, import.meta.url), 'utf8'));
          expect(win.document.querySelector('meta[name="referrer"]')?.getAttribute('content')).toBe('no-referrer');
        } finally { win.happyDOM.abort(); }
      }
    });
    for (const slug of slugs) test(`${base}${slug}/ serves captions and summaries without client rendering`, () => {
      const win = new Window(offline);
      try {
        win.document.write(readFileSync(new URL(`../dist${base}${slug}/index.html`, import.meta.url), 'utf8'));
        expect(win.document.querySelectorAll('h1')).toHaveLength(1);
        expect(win.document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`https://piindex.dev${base}${slug}/`);
        const data = JSON.parse(readFileSync(new URL(`../src/data/talks/${slug}.json`, import.meta.url), 'utf8'));
        if (data.youtube) {
          expect(win.document.querySelector('video')).toBeNull();
          const embed = win.document.querySelector(`iframe[data-youtube="${data.youtube}"]`);
          expect(embed).not.toBeNull();
          expect(embed?.getAttribute('src')).toStartWith(`https://www.youtube-nocookie.com/embed/${data.youtube}?`);
          expect(embed?.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin');
          expect(win.document.querySelector(`.talk-source a[href="https://www.youtube.com/watch?v=${data.youtube}"]`)).not.toBeNull();
          // YouTube draws its own top-right controls, so our overlay buttons
          // move out of the video: no fullscreen button, captions toggle below.
          expect(win.document.querySelector('[data-player-fullscreen]')).toBeNull();
          expect(win.document.querySelector('.talk-video [data-captions-toggle]')).toBeNull();
          expect(win.document.querySelector('.talk-source [data-caption-controls] [data-captions-toggle]')).not.toBeNull();
        } else {
          expect(win.document.querySelector('video source')?.getAttribute('src')).toStartWith('https://video.twimg.com/');
          expect(win.document.querySelector('track')?.getAttribute('src')).toBe(`${base}${slug}.vtt`);
          expect(win.document.querySelector('track')?.hasAttribute('default')).toBe(true);
          expect(win.document.querySelector('track')?.getAttribute('srclang')).toBe(locale === 'zh' ? 'zh-CN' : 'en');
          expect(win.document.querySelector('.talk-video [data-captions-toggle]')).not.toBeNull();
          expect(win.document.querySelector('.talk-video [data-player-fullscreen]')).not.toBeNull();
        }
        const firstCue = data.segments[0];
        const caption = locale === 'zh' ? firstCue.zh : firstCue.text;
        expect(win.document.querySelector('.transcript-line [lang]')?.textContent).toBe(caption);
        const vtt = readFileSync(new URL(`../dist${base}${slug}.vtt`, import.meta.url), 'utf8');
        expect(vtt).toContain(caption);
        expect(vtt.match(/ --> /g)?.length).toBe(data.segments.length);
        expect(win.document.querySelector('.talk-watch-layout .transcript-panel')).not.toBeNull();
        expect(win.document.querySelector('.talk-watch-layout .summary-panel')).toBeNull();
        expect(win.document.querySelectorAll('[data-start]').length).toBeGreaterThan(10);
        expect(win.document.querySelectorAll('[data-seek]').length).toBeGreaterThanOrEqual(3);
        expect(readFileSync(new URL(`../dist/talks/${slug}.vtt`, import.meta.url), 'utf8')).toStartWith('WEBVTT\n');
      } finally { win.happyDOM.abort(); }
    });
  }
  test('non-talk pages keep the default referrer policy', () => {
    const win = new Window();
    try {
      win.document.write(readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8'));
      expect(win.document.querySelector('meta[name="referrer"]')).toBeNull();
    } finally { win.happyDOM.abort(); }
  });
});
