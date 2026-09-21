import { matchesResource, readFilters, writeFilters, type Filters } from '../lib/filter';
import { text } from '../lib/i18n';
import { initializeInteractions } from './interactions';
import type { track } from '@vercel/analytics';

export function initializeDirectory(document: Document, window: Window, trackEvent?: typeof track): void {
  const root = document.querySelector<HTMLElement>('[data-directory]');
  if (!root) return;
  const locale = root.dataset.locale === 'zh' ? 'zh' : 'en';
  const t = text[locale];
  const input = document.querySelector<HTMLInputElement>('#search')!;
  const select = document.querySelector<HTMLSelectElement>('#mobile-category')!;
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-category]')];
  const rows = [...document.querySelectorAll<HTMLElement>('[data-resource]')].map(element => ({
    element, kind: element.dataset.kind!, categories: element.dataset.categories!.split(' '), searchText: element.dataset.search!,
  }));
  const categories = links.map(link => link.dataset.category!);
  let filters = readFilters(window.location.search, categories);
  const languageLink = document.querySelector<HTMLAnchorElement>('[data-language]')!;
  const languagePath = new URL(languageLink.href).pathname;
  const count = document.querySelector<HTMLElement>('#result-count')!;
  const empty = document.querySelector<HTMLElement>('#empty-state')!;
  const heading = document.querySelector<HTMLElement>('#results-heading')!;
  const clear = document.querySelector<HTMLButtonElement>('#clear-search')!;

  function render(history: 'replace' | 'push' | false = false): void {
    let visible = 0;
    for (const row of rows) {
      row.element.hidden = !matchesResource(row, filters);
      if (!row.element.hidden) visible++;
    }
    input.value = filters.q;
    select.value = filters.category;
    clear.hidden = !filters.q;
    count.textContent = locale === 'zh' ? `${visible} / ${rows.length} 项资源` : `${visible} of ${rows.length} resources`;
    empty.hidden = visible !== 0;
    heading.textContent = t.all;
    for (const link of links) {
      const active = link.dataset.category === filters.category;
      if (active) {
        link.setAttribute('aria-current', 'true');
        heading.textContent = link.dataset.label ?? link.textContent?.trim() ?? t.all;
      } else link.removeAttribute('aria-current');
      link.href = `${window.location.pathname}${writeFilters({ ...filters, category: link.dataset.category! })}`;
    }
    const query = writeFilters(filters);
    languageLink.href = `${languagePath}${query}`;
    if (history) window.history[history === 'push' ? 'pushState' : 'replaceState'](null, '', `${window.location.pathname}${query}${window.location.hash}`);
  }

  function update(next: Filters, history: 'replace' | 'push' = 'replace') { filters = next; render(history); }
  input.addEventListener('input', () => {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    update({ ...filters, q: input.value });
    if (start !== null && end !== null) {
      try { input.setSelectionRange(start, end); } catch { /* Search inputs do not expose selection in every browser. */ }
    }
  });
  clear.addEventListener('click', () => { update({ ...filters, q: '' }); input.focus(); });
  select.addEventListener('change', () => update({ ...filters, category: select.value }, 'push'));
  for (const link of links) link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    update({ ...filters, category: link.dataset.category! }, 'push');
  });
  document.querySelectorAll<HTMLButtonElement>('[data-reset]').forEach(button => {
    button.addEventListener('click', () => { update({ q: '', category: 'all' }, 'push'); input.focus(); });
  });
  window.addEventListener('popstate', () => { filters = readFilters(window.location.search, categories); render(); });

  initializeInteractions(document, window, trackEvent);
  render();
}
