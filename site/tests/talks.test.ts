import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import { Window, type HTMLButtonElement, type HTMLInputElement, type HTMLElement } from 'happy-dom';
import { activeSegment, toVtt } from '../src/lib/transcript';
import { initializeTalkPlayer } from '../src/scripts/talk-player';
import type { YouTubeApi } from '../src/scripts/youtube-media';
import type { Talk } from '../src/lib/talks';

const folder = new URL('../src/data/talks/', import.meta.url);
const talks = readdirSync(folder).map(file => JSON.parse(readFileSync(new URL(file, folder), 'utf8')) as Talk);

describe('video content integrity', () => {
  test('all five videos have complete timed transcripts and grounded summary anchors', () => {
    expect(talks).toHaveLength(5);
    expect(new Set(talks.map(talk => talk.slug)).size).toBe(5);
    for (const talk of talks) {
      expect(talk.segments.length).toBeGreaterThan(10);
      expect(talk.segments[0].start).toBeLessThan(15);
      expect(talk.segments.at(-1)!.end).toBeGreaterThan(talk.duration - 30);
      let previous = -1;
      for (const cue of talk.segments) {
        expect(cue.zh.trim().length).toBeGreaterThan(0);
        expect(cue.start).toBeGreaterThanOrEqual(previous);
        expect(cue.end).toBeGreaterThan(cue.start);
        expect(cue.end - cue.start).toBeLessThanOrEqual(8);
        expect(cue.end).toBeLessThanOrEqual(talk.duration + 1);
        expect(cue.text.trim().length).toBeGreaterThan(0);
        previous = cue.end;
      }
      for (const locale of ['en', 'zh'] as const) {
        expect(talk.summary[locale].length).toBeGreaterThanOrEqual(3);
        for (const point of talk.summary[locale]) {
          expect(point.start).toBeGreaterThanOrEqual(0);
          expect(point.start).toBeLessThan(talk.duration);
          expect(point.text.length).toBeGreaterThan(15);
        }
      }
    }
  });
  test('active cues handle gaps, seek backwards and exact boundaries', () => {
    const cues = [{ start: 1, end: 3 }, { start: 3, end: 5 }, { start: 7, end: 9 }];
    expect([0, 1, 3, 5, 7, 9, 2].map(time => activeSegment(cues, time))).toEqual([-1, 0, 1, -1, 2, -1, 0]);
    expect(activeSegment([], 2)).toBe(-1);
  });
  test('caption output escapes markup and handles hour boundaries', () => {
    expect(toVtt([{ start: 3599.999, end: 3602, text: 'A < B & C' }])).toContain('00:59:59.999 --> 01:00:02.000\nA &lt; B &amp; C');
  });
});

test('transcript interaction seeks, highlights, pauses follow and handles video errors', () => {
  const win = new Window({ url: 'https://piindex.dev/zh/talks/example/' });
  try {
    win.document.write(`<div data-talk-player><video></video><p data-video-error hidden></p><input type="checkbox" data-follow checked><div class="transcript-scroll"><button data-start="0" data-end="5">First</button><button data-start="7" data-end="12">Second</button></div><button data-seek="8">Summary</button></div>`);
    const doc = win.document;
    const video = doc.querySelector('video')!;
    const rows = doc.querySelectorAll<HTMLButtonElement>('[data-start]');
    initializeTalkPlayer(doc as unknown as Document);
    rows[1].click();
    expect(video.currentTime).toBe(7);
    expect(rows[1].getAttribute('aria-current')).toBe('true');
    expect(win.location.search).toBe('?t=7');
    video.currentTime = 1;
    video.dispatchEvent(new win.Event('timeupdate'));
    expect(rows[0].getAttribute('aria-current')).toBe('true');
    expect(rows[1].hasAttribute('aria-current')).toBe(false);
    doc.querySelector('.transcript-scroll')!.dispatchEvent(new win.Event('wheel'));
    expect(doc.querySelector<HTMLInputElement>('[data-follow]')!.checked).toBe(false);
    doc.querySelector<HTMLInputElement>('[data-follow]')!.click();
    expect(doc.querySelector<HTMLInputElement>('[data-follow]')!.checked).toBe(true);
    doc.querySelector<HTMLButtonElement>('[data-seek]')!.click();
    expect(video.currentTime).toBe(8);
    video.currentTime = 6;
    video.dispatchEvent(new win.Event('timeupdate'));
    expect(doc.querySelector('[aria-current]')).toBeNull();
    video.dispatchEvent(new win.Event('error'));
    expect(doc.querySelector<HTMLElement>('[data-video-error]')!.hidden).toBe(false);
  } finally { win.happyDOM.abort(); }
});

test('a failed source displays the playback error even when video has no error event', () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/' });
  try {
    win.document.write('<div data-talk-player><video><source src="/unavailable.mp4" type="video/mp4"></video><p data-video-error hidden></p><input type="checkbox" data-follow checked><div class="transcript-scroll"></div></div>');
    initializeTalkPlayer(win.document as unknown as Document);
    win.document.querySelector('source')!.dispatchEvent(new win.Event('error', { bubbles: false }));
    expect(win.document.querySelector<HTMLElement>('[data-video-error]')!.hidden).toBe(false);
  } finally { win.happyDOM.abort(); }
});

test('custom video captions follow the active sentence, clear gaps and toggle off', () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/' });
  try {
    win.document.write('<div data-talk-player><div class="talk-video"><video></video><div data-video-captions hidden><span></span></div><div data-caption-controls hidden><button data-captions-toggle aria-pressed="true">Captions</button></div></div><p data-video-error hidden></p><input type="checkbox" data-follow checked><div class="transcript-scroll"><button data-start="0" data-end="3"><span>0:00</span><span lang="en">First sentence.</span></button><button data-start="5" data-end="8"><span>0:05</span><span lang="en">Second sentence.</span></button></div></div>');
    const doc = win.document;
    const video = doc.querySelector('video')!;
    Object.defineProperty(video, 'textTracks', { value: Object.assign([], { addEventListener() {} }) });
    initializeTalkPlayer(doc as unknown as Document);
    const overlay = doc.querySelector<HTMLElement>('[data-video-captions]')!;
    video.currentTime = 1;
    video.dispatchEvent(new win.Event('timeupdate'));
    expect(overlay.textContent).toBe('First sentence.');
    expect(overlay.hidden).toBe(false);
    doc.querySelector<HTMLButtonElement>('[data-captions-toggle]')!.click();
    expect(overlay.hidden).toBe(true);
    doc.querySelector<HTMLButtonElement>('[data-captions-toggle]')!.click();
    video.currentTime = 4;
    video.dispatchEvent(new win.Event('timeupdate'));
    expect(overlay.hidden).toBe(true);
    video.currentTime = 6;
    video.dispatchEvent(new win.Event('timeupdate'));
    expect(overlay.textContent).toBe('Second sentence.');
    expect(overlay.hidden).toBe(false);
  } finally { win.happyDOM.abort(); }
});

describe('YouTube uploads', () => {
  test('exactly the two official uploads carry a valid video id', () => {
    const uploaded = talks.filter(talk => talk.youtube !== undefined);
    expect(uploaded.map(talk => talk.slug).sort()).toEqual(['changing-models', 'pi-durable']);
    for (const talk of uploaded) expect(talk.youtube).toMatch(/^[A-Za-z0-9_-]{11}$/);
  });
});

type FakeYouTubePlayer = {
  state: number;
  currentTime: number;
  duration: number;
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(time: number, ahead: boolean): void;
  cueVideoById(options: { videoId: string; startSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
};

function fakeYouTubeApi() {
  const calls = {
    cueVideoById: [] as { videoId: string; startSeconds?: number }[],
    seekTo: [] as [number, boolean][],
    playVideo: 0,
  };
  const player: FakeYouTubePlayer = {
    state: -1,
    currentTime: 0,
    duration: 120,
    getPlayerState() { return this.state; },
    getCurrentTime() { return this.currentTime; },
    getDuration() { return this.duration; },
    seekTo(time, ahead) { calls.seekTo.push([time, ahead]); this.currentTime = time; },
    cueVideoById(options) { calls.cueVideoById.push(options); this.currentTime = options.startSeconds ?? 0; },
    playVideo() { calls.playVideo += 1; },
    pauseVideo() {},
    mute() {},
  };
  let events: {
    onReady?: () => void;
    onStateChange?: (event: { data: number }) => void;
    onError?: (event: { data: number }) => void;
  } = {};
  const YT = {
    Player: function (_iframe: unknown, options: { events: typeof events }) {
      events = options.events;
      return player;
    },
  };
  return { YT, player, calls, events: () => events };
}

const youtubePageMarkup = (captions = false) => `<div data-talk-player><div class="talk-video"><iframe data-youtube="dQw4w9WgXcQ"></iframe>${captions
  ? '<div data-video-captions hidden><span></span></div><div data-caption-controls hidden><button data-captions-toggle aria-pressed="true">Captions</button></div>'
  : ''}</div><p data-video-error hidden></p><input type="checkbox" data-follow checked><div class="transcript-scroll"><button data-start="0" data-end="5"><span lang="en">First.</span></button><button data-start="7" data-end="12"><span lang="en">Second.</span></button></div><button data-seek="8">Summary</button></div>`;

function stubTimers(win: Window) {
  const intervals: (() => void)[] = [];
  win.setInterval = ((callback: () => void) => { intervals.push(callback); return 1; }) as unknown as typeof win.setInterval;
  win.clearInterval = (() => {}) as unknown as typeof win.clearInterval;
  return intervals;
}

test('YouTube talks cue summary timestamps without starting playback', async () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/' });
  try {
    win.document.write(youtubePageMarkup());
    const doc = win.document;
    const fake = fakeYouTubeApi();
    stubTimers(win);
    initializeTalkPlayer(doc as unknown as Document, { loadYouTube: () => Promise.resolve(fake.YT as unknown as YouTubeApi) });
    await Promise.resolve();
    fake.events().onReady?.();
    doc.querySelector<HTMLButtonElement>('[data-seek]')!.click();
    expect(fake.calls.cueVideoById).toEqual([{ videoId: 'dQw4w9WgXcQ', startSeconds: 8 }]);
    expect(fake.calls.seekTo).toHaveLength(0);
    expect(fake.calls.playVideo).toBe(0);
    const rows = doc.querySelectorAll<HTMLButtonElement>('[data-start]');
    expect(rows[1].getAttribute('aria-current')).toBe('true');
    expect(win.location.search).toBe('?t=8');
    expect(fake.player.getPlayerState()).not.toBe(1);
  } finally { win.happyDOM.abort(); }
});

test('YouTube seeks use seekTo while playing', async () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/' });
  try {
    win.document.write(youtubePageMarkup());
    const doc = win.document;
    const fake = fakeYouTubeApi();
    stubTimers(win);
    initializeTalkPlayer(doc as unknown as Document, { loadYouTube: () => Promise.resolve(fake.YT as unknown as YouTubeApi) });
    await Promise.resolve();
    fake.events().onReady?.();
    fake.player.state = 1;
    fake.events().onStateChange?.({ data: 1 });
    doc.querySelectorAll<HTMLButtonElement>('[data-start]')[1].click();
    expect(fake.calls.seekTo).toEqual([[7, true]]);
    expect(fake.calls.cueVideoById).toHaveLength(0);
    expect(fake.calls.playVideo).toBe(0);
  } finally { win.happyDOM.abort(); }
});

test('YouTube playback ticks move the highlight and overlay', async () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/' });
  try {
    win.document.write(youtubePageMarkup(true));
    const doc = win.document;
    const fake = fakeYouTubeApi();
    const intervals = stubTimers(win);
    initializeTalkPlayer(doc as unknown as Document, { loadYouTube: () => Promise.resolve(fake.YT as unknown as YouTubeApi) });
    await Promise.resolve();
    fake.events().onReady?.();
    fake.player.state = 1;
    fake.events().onStateChange?.({ data: 1 });
    expect(intervals.length).toBeGreaterThan(0);
    const rows = doc.querySelectorAll<HTMLButtonElement>('[data-start]');
    const overlay = doc.querySelector<HTMLElement>('[data-video-captions]')!;
    fake.player.currentTime = 1;
    intervals[0]();
    expect(rows[0].getAttribute('aria-current')).toBe('true');
    expect(overlay.textContent).toBe('First.');
    expect(overlay.hidden).toBe(false);
    fake.player.currentTime = 9;
    intervals[0]();
    expect(rows[1].getAttribute('aria-current')).toBe('true');
    expect(overlay.textContent).toBe('Second.');
    fake.player.state = 2;
    fake.events().onStateChange?.({ data: 2 });
    fake.player.currentTime = 1;
    expect(rows[1].getAttribute('aria-current')).toBe('true');
  } finally { win.happyDOM.abort(); }
});

test('YouTube deep links cue at the requested second without playing', async () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/?t=42' });
  try {
    win.document.write(youtubePageMarkup());
    const doc = win.document;
    const fake = fakeYouTubeApi();
    stubTimers(win);
    initializeTalkPlayer(doc as unknown as Document, { loadYouTube: () => Promise.resolve(fake.YT as unknown as YouTubeApi) });
    await Promise.resolve();
    expect(fake.calls.cueVideoById).toHaveLength(0);
    fake.events().onReady?.();
    expect(fake.calls.cueVideoById).toEqual([{ videoId: 'dQw4w9WgXcQ', startSeconds: 42 }]);
    expect(fake.calls.playVideo).toBe(0);
  } finally { win.happyDOM.abort(); }
});

test('YouTube player errors surface the fallback message', async () => {
  const win = new Window({ url: 'https://piindex.dev/talks/example/' });
  try {
    win.document.write(youtubePageMarkup());
    const doc = win.document;
    const fake = fakeYouTubeApi();
    stubTimers(win);
    initializeTalkPlayer(doc as unknown as Document, { loadYouTube: () => Promise.resolve(fake.YT as unknown as YouTubeApi) });
    await Promise.resolve();
    fake.events().onError?.({ data: 150 });
    expect(doc.querySelector<HTMLElement>('[data-video-error]')!.hidden).toBe(false);
  } finally { win.happyDOM.abort(); }
});
