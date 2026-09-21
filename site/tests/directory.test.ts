import { afterEach, describe, expect, test } from 'bun:test';
import { Window, type HTMLInputElement, type HTMLSelectElement, type HTMLButtonElement, type HTMLAnchorElement, type HTMLElement } from 'happy-dom';
import { initializeDirectory } from '../src/scripts/directory';
import { initializeInteractions } from '../src/scripts/interactions';

type RecordedEvent = { name: string; properties?: Record<string, unknown> };
const recorder = (events: RecordedEvent[]) => (name: string, options: { props: Record<string, unknown> }) => { events.push({ name, properties: options.props }); };

const windows: Window[] = [];
function setup(path = '/', events: RecordedEvent[] = []) {
  const win = new Window({ url: `https://example.com${path}` });
  windows.push(win);
  win.document.body.innerHTML = `
    <main data-directory data-interactions data-locale="en" data-surface="home" data-total="2">
      <input id="search" type="search"><button id="clear-search">Clear</button>
      <select id="mobile-category"><option value="all">All</option><option value="web-access-search">Web</option><option value="themes">Themes</option></select>
      <a data-category="all" href="/">All resources</a><a data-category="web-access-search" href="?category=web-access-search">Web</a><a data-category="themes" href="?category=themes">Themes</a>
      <a class="guide-link" href="/categories/web-access-search/">Web guide</a>
      <a class="package-link" href="/packages/pi-web-access/">Package guide</a>
      <a class="topic-link" href="/topics/jev/">Jev topic</a>
      <a data-repo-link data-package="@scope/search" data-destination="github" href="https://github.com/example/search">Repository</a>
      <h2 id="results-heading">All resources</h2><span id="result-count"></span>
      <p id="empty-state" hidden>No results <button data-reset>Reset</button></p>
      <a data-language href="/zh/">中文</a>
      <article data-resource data-kind="packages" data-categories="web-access-search" data-search="search brave 网页 web access search"><button data-copy="pi install npm:search" data-package="@scope/search"><span data-copy-label>Copy</span></button></article>
      <article data-resource data-kind="themes" data-categories="dark-themes" data-search="theme dark"><button data-copy="pi install npm:theme"><span data-copy-label>Copy</span></button></article>
      <p id="copy-status" role="status"></p>
    </main>`;
  Object.assign(win, { plausible: recorder(events) });
  initializeDirectory(win.document as unknown as Document, win as unknown as globalThis.Window);
  return win;
}
afterEach(() => { for (const win of windows.splice(0)) win.happyDOM.abort(); });

describe('directory interactions', () => {
  test('restores a shared search and category on first load and keeps them when switching language', () => {
    const win = setup('/?q=Brave&category=web-access-search');
    expect(win.document.querySelector<HTMLInputElement>('#search')!.value).toBe('Brave');
    expect(win.document.querySelectorAll('[data-resource]:not([hidden])').length).toBe(1);
    expect(win.document.querySelector<HTMLAnchorElement>('[data-language]')!.href).toBe('https://example.com/zh/?q=Brave&category=web-access-search');
  });
  test('filters immediately, handles empty results, and clears both controls', () => {
    const win = setup();
    const input = win.document.querySelector<HTMLInputElement>('#search')!;
    input.value = 'missing';
    input.dispatchEvent(new win.Event('input'));
    expect(win.document.querySelector<HTMLElement>('#empty-state')!.hidden).toBe(false);
    expect(win.location.search).toBe('?q=missing');
    win.document.querySelector<HTMLButtonElement>('[data-reset]')!.click();
    expect(input.value).toBe('');
    expect(win.document.querySelectorAll('[data-resource]:not([hidden])').length).toBe(2);
    expect(win.location.search).toBe('');
  });
  test('category links and the mobile selector apply filters and update the selected state', () => {
    const win = setup();
    win.document.querySelector<HTMLAnchorElement>('[data-category="themes"]')!.click();
    expect(win.document.querySelectorAll('[data-resource]:not([hidden])').length).toBe(1);
    expect(win.document.querySelector('[data-category="themes"]')!.getAttribute('aria-current')).toBe('true');
    const select = win.document.querySelector<HTMLSelectElement>('#mobile-category')!;
    expect(select.value).toBe('themes');
    select.value = 'all';
    select.dispatchEvent(new win.Event('change'));
    expect(win.document.querySelectorAll('[data-resource]:not([hidden])').length).toBe(2);
  });
  test('restores search and category when navigating back', () => {
    const win = setup();
    win.history.replaceState(null, '', '/?q=theme&category=themes');
    win.dispatchEvent(new win.PopStateEvent('popstate'));
    expect(win.document.querySelector<HTMLInputElement>('#search')!.value).toBe('theme');
    expect(win.document.querySelectorAll('[data-resource]:not([hidden])').length).toBe(1);
  });
  test.each(['guide-link', 'package-link', 'topic-link'])('%s preserves native navigation and the current filter', className => {
    const events: RecordedEvent[] = [];
    const win = setup('/?q=Brave&category=web-access-search', events);
    const link = win.document.querySelector<HTMLAnchorElement>(`.${className}`)!;
    const href = link.href;
    const event = new win.MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(link.href).toBe(href);
    expect(win.document.querySelector<HTMLInputElement>('#search')!.value).toBe('Brave');
    expect(win.document.querySelector<HTMLSelectElement>('#mobile-category')!.value).toBe('web-access-search');
    expect(win.document.querySelectorAll('[data-resource]:not([hidden])').length).toBe(1);
    expect(events).toEqual([]);
  });
  test('tracks a repository click without preventing native navigation', () => {
    const events: RecordedEvent[] = [];
    const win = setup('/', events);
    const event = new win.MouseEvent('click', { bubbles: true, cancelable: true });
    win.document.querySelector('[data-repo-link]')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(events).toEqual([{ name: 'repo_clicked', properties: { package: '@scope/search', locale: 'en', surface: 'home', destination: 'github' } }]);
  });
  test('counts command copies only after the clipboard resolves', async () => {
    const events: RecordedEvent[] = [];
    const win = setup('/', events);
    let finishCopy!: () => void;
    const pendingCopy = new Promise<void>(resolve => { finishCopy = resolve; });
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: () => pendingCopy } });
    const button = win.document.querySelector<HTMLButtonElement>('[data-copy]')!;
    button.click();
    expect(button.disabled).toBe(true);
    expect(events).toEqual([]);
    finishCopy();
    await pendingCopy;
    expect(events).toEqual([{ name: 'command_copied', properties: { package: '@scope/search', locale: 'en', surface: 'home' } }]);
    expect(button.disabled).toBe(false);
  });
  test('keeps successful copies and repository clicks available while analytics loads', async () => {
    const win = setup();
    const browser = win as unknown as globalThis.Window;
    Reflect.deleteProperty(browser, 'plausible');
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
    win.document.querySelector<HTMLButtonElement>('[data-copy]')!.click();
    await Promise.resolve();
    const event = new win.MouseEvent('click', { bubbles: true, cancelable: true });
    win.document.querySelector('[data-repo-link]')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(win.document.querySelector('[data-copy-label]')!.textContent).toBe('Copied');
    expect(browser.plausible?.q).toEqual([
      ['command_copied', { props: { package: '@scope/search', locale: 'en', surface: 'home' } }],
      ['repo_clicked', { props: { package: '@scope/search', locale: 'en', surface: 'home', destination: 'github' } }],
    ]);
  });
  test('copies the exact command and announces success only after the clipboard write completes', async () => {
    const win = setup();
    const copied: string[] = [];
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { copied.push(value); } } });
    win.document.querySelector<HTMLButtonElement>('[data-copy]')!.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(copied).toEqual(['pi install npm:search']);
    expect(win.document.querySelector('[data-copy-label]')!.textContent).toBe('Copied');
    expect(win.document.querySelector('#copy-status')!.textContent).toContain('copied');
  });
  test('reports clipboard failure with a manual-copy instruction', async () => {
    const events: RecordedEvent[] = [];
    const win = setup('/', events);
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } });
    win.document.querySelector<HTMLButtonElement>('[data-copy]')!.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(win.document.querySelector('[data-copy-label]')!.textContent).toBe('Copy');
    expect(win.document.querySelector('#copy-status')!.textContent).toContain('manually');
    expect(events).toEqual([]);
  });
  test('dismisses temporary copy feedback instead of leaving a permanent toast', async () => {
    const win = setup();
    const callbacks: Array<() => void> = [];
    win.setTimeout = callback => { callbacks.push(() => callback()); return setTimeout(() => {}, 0); };
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
    win.document.querySelector<HTMLButtonElement>('[data-copy]')!.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    callbacks.forEach(callback => callback());
    expect(win.document.querySelector('#copy-status')!.textContent).toBe('');
  });
});

describe('content page interactions', () => {
  function setupContent(surface: 'topic' | 'category' | 'detail', events: RecordedEvent[]) {
    const win = new Window({ url: `https://example.com/zh/topics/jev/` });
    windows.push(win);
    win.document.body.innerHTML = `
      <main data-interactions data-locale="zh" data-surface="${surface}">
        <button data-copy="pi install npm:pi-jev-model-router" data-package="pi-jev-model-router"><span data-copy-label>复制</span></button>
        <a data-repo-link data-package="pi-jev-model-router" data-destination="npm" href="https://www.npmjs.com/package/pi-jev-model-router">npm</a>
        <a class="package-link" href="/zh/packages/pi-web-access/">已发布详情</a>
        <a class="official-link" href="https://typesafe.ai/">TypeSafe 官网</a>
        <button data-copy="[![Pi Index](https://piindex.dev/badge/pi-web-access.svg)](https://piindex.dev/packages/pi-web-access/)"><span data-copy-label>复制徽章</span></button>
        <p id="copy-status" role="status"></p>
      </main>`;
    Object.assign(win, { plausible: recorder(events) });
    initializeInteractions(win.document as unknown as Document, win as unknown as globalThis.Window);
    return win;
  }

  test.each(['topic', 'category', 'detail'] as const)('%s copies and tracks resources without requiring a published detail page', async surface => {
    const events: RecordedEvent[] = [];
    const win = setupContent(surface, events);
    const copied: string[] = [];
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { copied.push(value); } } });
    win.document.querySelector<HTMLButtonElement>('[data-copy][data-package]')!.click();
    await Promise.resolve();
    const event = new win.MouseEvent('click', { bubbles: true, cancelable: true });
    win.document.querySelector('[data-repo-link]')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(copied).toEqual(['pi install npm:pi-jev-model-router']);
    expect(events).toEqual([
      { name: 'command_copied', properties: { package: 'pi-jev-model-router', locale: 'zh', surface } },
      { name: 'repo_clicked', properties: { package: 'pi-jev-model-router', locale: 'zh', surface, destination: 'npm' } },
    ]);
  });

  test('does not count internal navigation, the TypeSafe website, or badge snippets as package conversions', async () => {
    const events: RecordedEvent[] = [];
    const win = setupContent('topic', events);
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async () => {} } });
    for (const selector of ['.package-link', '.official-link']) {
      const event = new win.MouseEvent('click', { bubbles: true, cancelable: true });
      win.document.querySelector(selector)!.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    }
    win.document.querySelector<HTMLButtonElement>('[data-copy]:not([data-package])')!.click();
    await Promise.resolve();
    expect(events).toEqual([]);
    expect(win.document.querySelector<HTMLButtonElement>('[data-copy]:not([data-package]) [data-copy-label]')!.textContent).toBe('已复制');
  });

  test('does not track a failed copy on a topic page', async () => {
    const events: RecordedEvent[] = [];
    const win = setupContent('topic', events);
    Object.defineProperty(win.navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('denied'); } } });
    win.document.querySelector<HTMLButtonElement>('[data-copy][data-package]')!.click();
    await Promise.resolve();
    expect(events).toEqual([]);
    expect(win.document.querySelector('#copy-status')!.textContent).toContain('手动复制');
  });
});
