import { track } from './analytics';
import { text } from '../lib/i18n';

export function initializeInteractions(document: Document, window: Window): void {
  const root = document.querySelector<HTMLElement>('[data-interactions]');
  if (!root) return;
  const locale = root.dataset.locale === 'zh' ? 'zh' : 'en';
  const surface = root.dataset.surface ?? 'home';
  const t = text[locale];
  const status = root.querySelector<HTMLElement>('#copy-status');
  let statusTimeout: number | undefined;

  function announceCopy(message: string): void {
    if (!status) return;
    window.clearTimeout(statusTimeout);
    status.textContent = message;
    statusTimeout = window.setTimeout(() => { status.textContent = ''; }, 4000);
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const label = button.querySelector<HTMLElement>('[data-copy-label]');
    const originalLabel = label?.textContent ?? t.copy;
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        await window.navigator.clipboard.writeText(button.dataset.copy!);
      } catch {
        announceCopy(t.copyError);
        return;
      } finally {
        button.disabled = false;
      }
      if (label) label.textContent = t.copied;
      announceCopy(button.dataset.package ? t.copiedStatus : (locale === 'zh' ? '已复制。' : 'Copied.'));
      button.dataset.copied = 'true';
      window.setTimeout(() => {
        if (label) label.textContent = originalLabel;
        delete button.dataset.copied;
      }, 1800);
      if (button.dataset.package) {
        track(window, 'command_copied', { package: button.dataset.package, locale, surface });
      }
    });
  }

  for (const link of root.querySelectorAll<HTMLAnchorElement>('[data-repo-link][data-package]')) {
    const destination = link.dataset.destination;
    if (destination !== 'github' && destination !== 'npm') continue;
    link.addEventListener('click', () => {
      track(window, 'repo_clicked', { package: link.dataset.package!, locale, surface, destination });
    });
  }
}
