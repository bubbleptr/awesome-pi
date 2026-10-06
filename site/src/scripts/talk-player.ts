import { activeSegment } from '../lib/transcript';
import { createYouTubeMedia, loadYouTubeApi, type MediaClock, type YouTubeApi } from './youtube-media';

export type TalkPlayerOptions = {
  loadYouTube?: (win: Window) => Promise<YouTubeApi>;
};

function createVideoMedia(video: HTMLVideoElement): MediaClock {
  const listeners = new Set<() => void>();
  const notify = () => { for (const listener of listeners) listener(); };
  video.addEventListener('timeupdate', notify);
  video.addEventListener('seeked', notify);
  return {
    time: () => video.currentTime,
    duration: () => video.duration,
    seek: time => { video.currentTime = time; },
    onTick: listener => { listeners.add(listener); },
    whenReady: fn => {
      if (video.readyState >= 1) fn();
      else video.addEventListener('loadedmetadata', fn, { once: true });
    },
  };
}

export function initializeTalkPlayer(doc: Document, options?: TalkPlayerOptions): void {
  const root = doc.querySelector<HTMLElement>('[data-talk-player]');
  const video = root?.querySelector('video') ?? null;
  const youtubeFrame = root?.querySelector<HTMLIFrameElement>('iframe[data-youtube]') ?? null;
  if (!root || (!video && !youtubeFrame) || root.dataset.initialized) return;
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

  const media: MediaClock = video ? createVideoMedia(video) : (() => {
    // Facade so transcript controls keep working while the IFrame API loads;
    // the real clock replaces the queued calls once created.
    let clock: MediaClock | null = null;
    let queuedSeek: number | null = null;
    const queuedTicks = new Set<() => void>();
    const queuedReady: (() => void)[] = [];
    const load = options?.loadYouTube ?? loadYouTubeApi;
    load(win).then(YT => {
      clock = createYouTubeMedia(youtubeFrame!, YT, win, () => { error.hidden = false; });
      for (const listener of queuedTicks) clock.onTick(listener);
      queuedTicks.clear();
      for (const fn of queuedReady.splice(0)) clock.whenReady(fn);
      if (queuedSeek !== null) { clock.seek(queuedSeek); queuedSeek = null; }
    }, () => { error.hidden = false; });
    return {
      time: () => clock?.time() ?? queuedSeek ?? 0,
      duration: () => clock?.duration() ?? NaN,
      seek: time => {
        if (clock) clock.seek(time);
        else {
          queuedSeek = time;
          for (const listener of queuedTicks) listener();
        }
      },
      onTick: listener => { if (clock) clock.onTick(listener); else queuedTicks.add(listener); },
      whenReady: fn => { if (clock) clock.whenReady(fn); else queuedReady.push(fn); },
      playing: () => clock?.playing?.() ?? false,
    };
  })();

  function renderCaptions(): void {
    if (!captions || !captionText) return;
    captionText.textContent = current < 0 ? '' : rows[current].querySelector('[lang]')?.textContent ?? rows[current].textContent;
    captions.hidden = !captionsEnabled || nativeFullscreen || current < 0;
  }

  function updateCaptionMode(): void {
    if (!captions) return;
    if (video) for (const track of Array.from(video.textTracks)) {
      track.mode = nativeFullscreen && captionsEnabled ? 'showing' : 'disabled';
    }
    renderCaptions();
  }

  if (captions) {
    root.querySelector<HTMLElement>('[data-caption-controls]')!.hidden = false;
    updateCaptionMode();
    captionToggle?.addEventListener('click', () => {
      captionsEnabled = !captionsEnabled;
      captionToggle.setAttribute('aria-pressed', String(captionsEnabled));
      updateCaptionMode();
    });
    if (frame?.requestFullscreen && fullscreen) {
      video?.setAttribute('controlslist', 'nofullscreen');
      fullscreen.addEventListener('click', async () => {
        if (doc.fullscreenElement) await doc.exitFullscreen();
        else await frame.requestFullscreen();
      });
    } else if (fullscreen) fullscreen.hidden = true;
    if (youtubeFrame && frame) {
      // Raise the caption overlay only while YouTube's own controls are likely
      // visible. Pointer boundary events do not reach us across the cross-origin
      // iframe, so this tracks playback state: controls show whenever not playing.
      const updateControls = () => {
        if (media.playing?.()) frame.removeAttribute('data-controls');
        else frame.setAttribute('data-controls', '');
      };
      media.onTick(updateControls);
      updateControls();
    }
    if (video) {
      video.addEventListener('loadedmetadata', updateCaptionMode);
      video.textTracks.addEventListener('addtrack', updateCaptionMode);
      doc.addEventListener('fullscreenchange', () => {
        nativeFullscreen = doc.fullscreenElement === video;
        updateCaptionMode();
      });
      video.addEventListener('webkitbeginfullscreen', () => { nativeFullscreen = true; updateCaptionMode(); });
      video.addEventListener('webkitendfullscreen', () => { nativeFullscreen = false; updateCaptionMode(); });
    }
  }

  if (video) {
    video.addEventListener('error', () => { error.hidden = false; });
    video.querySelector('source')?.addEventListener('error', () => { error.hidden = false; });
    if (video.error || video.networkState === 3) error.hidden = false;
    video.addEventListener('loadeddata', () => { error.hidden = true; });
  }

  function sync(force = false): void {
    const next = activeSegment(segments, media.time());
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
    const duration = media.duration();
    if (Number.isFinite(duration)) time = Math.min(time, duration);
    media.seek(time);
    sync(true);
    const url = new URL(win.location.href);
    url.searchParams.set('t', String(Math.floor(time)));
    win.history.replaceState(null, '', url);
  }

  for (const row of rows) row.addEventListener('click', () => seek(Number(row.dataset.start)));
  for (const point of root.querySelectorAll<HTMLButtonElement>('[data-seek]')) {
    point.addEventListener('click', () => seek(Number(point.dataset.seek)));
  }
  media.onTick(() => sync());
  follow.addEventListener('change', () => sync(true));
  const stopFollowing = () => { follow.checked = false; };
  scroll.addEventListener('wheel', stopFollowing, { passive: true });
  scroll.addEventListener('touchmove', stopFollowing, { passive: true });
  scroll.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) stopFollowing();
  });
  const initialTime = new URL(win.location.href).searchParams.get('t');
  if (initialTime !== null && Number.isFinite(Number(initialTime)) && Number(initialTime) >= 0) {
    media.whenReady(() => seek(Number(initialTime)));
  }
}
