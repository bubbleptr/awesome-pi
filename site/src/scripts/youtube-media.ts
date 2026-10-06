export type MediaClock = {
  time(): number;
  duration(): number;
  seek(time: number): void;
  onTick(listener: () => void): void;
  whenReady(fn: () => void): void;
};

export type YouTubePlayer = {
  getPlayerState(): number;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  cueVideoById(options: { videoId: string; startSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
};

export type YouTubeApi = {
  Player: new (iframe: HTMLIFrameElement, options: {
    events: {
      onReady?: () => void;
      onStateChange?: (event: { data: number }) => void;
      onError?: (event: { data: number }) => void;
    };
  }) => YouTubePlayer;
};

type YouTubeWindow = Window & {
  YT?: YouTubeApi;
  onYouTubeIframeAPIReady?: () => void;
};

// YT.PlayerState values from the IFrame Player API docs.
const UNSTARTED = -1;
const PLAYING = 1;
const CUED = 5;

const apiScript = 'https://www.youtube.com/iframe_api';

export function loadYouTubeApi(win: Window): Promise<YouTubeApi> {
  const ytWin = win as YouTubeWindow;
  if (ytWin.YT?.Player) return Promise.resolve(ytWin.YT);
  return new Promise((resolve, reject) => {
    const previous = ytWin.onYouTubeIframeAPIReady;
    ytWin.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (ytWin.YT?.Player) resolve(ytWin.YT);
      else reject(new Error('YouTube iframe API loaded without a player'));
    };
    if (!win.document.querySelector(`script[src="${apiScript}"]`)) {
      const script = win.document.createElement('script');
      script.src = apiScript;
      script.addEventListener('error', () => reject(new Error('YouTube iframe API failed to load')));
      win.document.head.appendChild(script);
    }
  });
}

export function createYouTubeMedia(
  iframe: HTMLIFrameElement,
  YT: YouTubeApi,
  win: Window,
  onError: (event?: unknown) => void,
): MediaClock {
  const videoId = iframe.dataset.youtube!;
  const listeners = new Set<() => void>();
  const readyCallbacks: (() => void)[] = [];
  let ready = false;
  // Seek target the player has not reported yet: queued before ready, applied
  // via cueVideoById when cued/unstarted (keeps it paused), and held while the
  // reported currentTime catches up after a seek.
  let pending: number | null = null;
  let timer: number | null = null;

  const notify = () => { for (const listener of listeners) listener(); };
  const stopTicking = () => {
    if (timer !== null) { win.clearInterval(timer); timer = null; }
  };

  const player = new YT.Player(iframe, {
    events: {
      onReady: () => {
        ready = true;
        if (pending !== null) player.cueVideoById({ videoId, startSeconds: pending });
        for (const fn of readyCallbacks.splice(0)) fn();
      },
      onStateChange: event => {
        if (event.data === PLAYING) {
          pending = null;
          if (timer === null) {
            timer = win.setInterval(() => { pending = null; notify(); }, 250);
          }
        } else {
          stopTicking();
        }
        notify();
      },
      onError: event => { stopTicking(); onError(event); },
    },
  });

  return {
    time: () => pending ?? (ready ? player.getCurrentTime() : 0),
    duration: () => {
      if (!ready) return NaN;
      const duration = player.getDuration();
      return duration > 0 ? duration : NaN;
    },
    seek: time => {
      if (!ready) {
        pending = time;
      } else {
        const state = player.getPlayerState();
        if (state === UNSTARTED || state === CUED) {
          // seekTo on an unstarted player would begin playback; cueing keeps it paused.
          player.cueVideoById({ videoId, startSeconds: time });
        } else {
          player.seekTo(time, true);
        }
        pending = time;
      }
      notify();
    },
    onTick: listener => { listeners.add(listener); },
    whenReady: fn => { if (ready) fn(); else readyCallbacks.push(fn); },
  };
}
