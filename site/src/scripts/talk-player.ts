import { activeSegment } from '../lib/transcript';

export function initializeTalkPlayer(doc: Document): void {
  const root = doc.querySelector<HTMLElement>('[data-talk-player]');
  const video = root?.querySelector('video');
  if (!root || !video || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const win = doc.defaultView!;
  const rows = [...root.querySelectorAll<HTMLButtonElement>('[data-start]')];
  const segments = rows.map(row => ({ start: Number(row.dataset.start), end: Number(row.dataset.end) }));
  const scroll = root.querySelector<HTMLElement>('.transcript-scroll')!;
  const follow = root.querySelector<HTMLInputElement>('[data-follow]')!;
  const error = root.querySelector<HTMLElement>('[data-video-error]')!;
  const captions = root.querySelector<HTMLElement>('[data-video-captions]');
  const captionText = captions?.querySelector('span');
  const captionToggle = root.querySelector<HTMLButtonElement>('[data-captions-toggle]');
  const frame = root.querySelector<HTMLElement>('.talk-video');
  const fullscreen = root.querySelector<HTMLButtonElement>('[data-player-fullscreen]');
  let captionsEnabled = true;
  let nativeFullscreen = false;
  let current = -1;

  function renderCaptions(): void {
    if (!captions || !captionText) return;
    captionText.textContent = current < 0 ? '' : rows[current].querySelector('[lang]')?.textContent ?? rows[current].textContent;
    captions.hidden = !captionsEnabled || nativeFullscreen || current < 0;
  }

  function updateCaptionMode(): void {
    if (!captions) return;
    for (const track of Array.from(video!.textTracks)) {
      track.mode = nativeFullscreen && captionsEnabled ? 'showing' : 'disabled';
    }
    renderCaptions();
  }

  if (captions) {
    root.querySelector<HTMLElement>('[data-caption-controls]')!.hidden = false;
    updateCaptionMode();
    video.addEventListener('loadedmetadata', updateCaptionMode);
    video.textTracks.addEventListener('addtrack', updateCaptionMode);
    captionToggle?.addEventListener('click', () => {
      captionsEnabled = !captionsEnabled;
      captionToggle.setAttribute('aria-pressed', String(captionsEnabled));
      updateCaptionMode();
    });
    if (frame?.requestFullscreen && fullscreen) {
      video.setAttribute('controlslist', 'nofullscreen');
      fullscreen.addEventListener('click', async () => {
        if (doc.fullscreenElement) await doc.exitFullscreen();
        else await frame.requestFullscreen();
      });
    } else if (fullscreen) fullscreen.hidden = true;
    doc.addEventListener('fullscreenchange', () => {
      nativeFullscreen = doc.fullscreenElement === video;
      updateCaptionMode();
    });
    video.addEventListener('webkitbeginfullscreen', () => { nativeFullscreen = true; updateCaptionMode(); });
    video.addEventListener('webkitendfullscreen', () => { nativeFullscreen = false; updateCaptionMode(); });
  }

  function sync(force = false): void {
    const next = activeSegment(segments, video!.currentTime);
    if (next === current && !force) return;
    if (current >= 0) rows[current].removeAttribute('aria-current');
    current = next;
    renderCaptions();
    if (next < 0) return;
    const row = rows[next];
    row.setAttribute('aria-current', 'true');
    if (follow.checked) {
      const top = row.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop;
      const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroll.scrollTo({ top: Math.max(0, top - scroll.clientHeight / 2 + row.clientHeight / 2), behavior: force || reducedMotion ? 'instant' : 'smooth' });
    }
  }

  function seek(time: number): void {
    if (!Number.isFinite(time) || time < 0) return;
    if (Number.isFinite(video!.duration)) time = Math.min(time, video!.duration);
    video!.currentTime = time;
    sync(true);
    const url = new URL(win.location.href);
    url.searchParams.set('t', String(Math.floor(time)));
    win.history.replaceState(null, '', url);
  }

  for (const row of rows) row.addEventListener('click', () => seek(Number(row.dataset.start)));
  for (const point of root.querySelectorAll<HTMLButtonElement>('[data-seek]')) {
    point.addEventListener('click', () => seek(Number(point.dataset.seek)));
  }
  video.addEventListener('timeupdate', () => sync());
  video.addEventListener('seeked', () => sync());
  video.addEventListener('error', () => { error.hidden = false; });
  video.querySelector('source')?.addEventListener('error', () => { error.hidden = false; });
  if (video.error || video.networkState === 3) error.hidden = false;
  video.addEventListener('loadeddata', () => { error.hidden = true; });
  follow.addEventListener('change', () => sync(true));
  const stopFollowing = () => { follow.checked = false; };
  scroll.addEventListener('wheel', stopFollowing, { passive: true });
  scroll.addEventListener('touchmove', stopFollowing, { passive: true });
  scroll.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) stopFollowing();
  });
  const initialTime = new URL(win.location.href).searchParams.get('t');
  if (initialTime !== null && Number.isFinite(Number(initialTime)) && Number(initialTime) >= 0) {
    if (video.readyState >= 1) seek(Number(initialTime));
    else video.addEventListener('loadedmetadata', () => seek(Number(initialTime)), { once: true });
  }
}
