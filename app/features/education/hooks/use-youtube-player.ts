import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A YouTube lesson, driven through the IFrame Player API.
 *
 * A plain `<iframe src="…/embed/…">` tells the page nothing about what the
 * learner did with it, so a video lesson could only ever be marked finished on
 * having been opened. Loading the API puts the player under script control:
 * `onStateChange` says when it is playing and when it ends, and `getCurrentTime`
 * says where it is, which together are what the gate needs.
 *
 * Only the handful of API members used here are declared, rather than adding a
 * dependency for the whole surface.
 */

interface YouTubePlayer {
  getCurrentTime(): number;
  getDuration(): number;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

interface YouTubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      /** Set on the iframe the API builds, which is otherwise 640×360. */
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: YouTubePlayerEvent) => void;
        onStateChange?: (event: YouTubePlayerEvent) => void;
        onError?: (event: YouTubePlayerEvent) => void;
      };
    },
  ) => YouTubePlayer;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

/** The states the API reports, which it only publishes once it has loaded. */
const ENDED = 0;
const PLAYING = 1;

let pendingApi: Promise<YouTubeApi> | null = null;

/**
 * Loads the IFrame API once per document.
 *
 * The API announces itself by calling a single global hook, so a second copy
 * of the script would overwrite the first one's callback. Every player waits
 * on the same promise instead, and a failed load clears it so a later lesson
 * can try again.
 */
function loadYouTubeApi(): Promise<YouTubeApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("The YouTube player needs a browser"));
  }

  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pendingApi) return pendingApi;

  pendingApi = new Promise<YouTubeApi>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      const api = window.YT;
      if (api?.Player) resolve(api);
      else reject(new Error("The YouTube player did not load"));
    };

    const script = document.createElement("script");
    script.src = IFRAME_API_SRC;
    script.async = true;
    script.onerror = () => {
      pendingApi = null;
      reject(new Error("The YouTube player could not be loaded"));
    };

    document.head.appendChild(script);
  });

  return pendingApi;
}

/**
 * How often the player is asked where it is while it plays.
 *
 * Coverage is kept in whole seconds, so the poll has to be quicker than one
 * second of media or a second would go uncounted. 400ms leaves room for
 * YouTube's fastest playback rate of 2× and still lands inside every bucket.
 */
const POLL_MS = 400;

/**
 * How often it is asked while it is not playing.
 *
 * The IFrame API publishes no seek event, so dragging the scrub bar is only
 * visible as the play head being somewhere new. That has to be watched for
 * while the video is paused too: a learner who pauses, scrubs, and closes the
 * tab would otherwise be brought back to where they paused rather than where
 * they left the play head. Nothing is being counted at this point, so once a
 * second is plenty.
 */
const IDLE_POLL_MS = 1000;

export interface YouTubeLessonPlayer {
  containerRef: (node: HTMLDivElement | null) => void;
  isReady: boolean;
  isPlaying: boolean;
  hasEnded: boolean;
  /** Zero until the player reports it, so callers must handle "not yet". */
  durationSeconds: number;
  /** The play head, tracked through seeks as well as playback. */
  currentTime: number;
  error: string | null;
  toggle: () => void;
}

export function useYouTubePlayer({
  videoId,
  startSeconds = 0,
  onProgress,
}: {
  videoId: string | null;
  /**
   * Where to cue the video, from the learner's saved resume point.
   *
   * Passed as the player's own `start` rather than seeking after it loads, so
   * the lesson opens at the right place instead of jumping there.
   */
  startSeconds?: number;
  /** Called with the play position, often enough to count every second. */
  onProgress?: (seconds: number) => void;
}): YouTubeLessonPlayer {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /* Held in a ref so a new callback identity does not tear the player down and
     rebuild it — that would restart the video on every parent render. */
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  /* Read once per player build rather than tracked: re-cueing a video because
     the saved position moved on is the opposite of what a resume point is
     for. The effect below is keyed on the lesson, not on this. */
  const startRef = useRef(startSeconds);
  startRef.current = startSeconds;

  useEffect(() => {
    if (!container || !videoId) return;

    let cancelled = false;
    let player: YouTubePlayer | null = null;

    setIsReady(false);
    setIsPlaying(false);
    setHasEnded(false);
    setDurationSeconds(0);
    setCurrentTime(startRef.current);
    setError(null);

    /* The API replaces the element it is handed with its own iframe, so it gets
       a child of our own making: React keeps owning `container`, and cleanup
       has something it can safely empty. */
    const mount = document.createElement("div");
    mount.className = "size-full";
    container.replaceChildren(mount);

    loadYouTubeApi()
      .then((api) => {
        if (cancelled) return;

        player = new api.Player(mount, {
          videoId,
          /* The API builds its own iframe at a fixed 640×360 unless told
             otherwise; the container's CSS below covers the same ground for
             anything the attributes miss. */
          width: "100%",
          height: "100%",
          playerVars: {
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
            start: Math.max(0, Math.floor(startRef.current)),
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              setIsReady(true);
              setDurationSeconds(event.target.getDuration() || 0);
            },
            onStateChange: (event) => {
              if (cancelled) return;

              const state = event.data;
              setIsPlaying(state === PLAYING);

              /* Duration is unknown until the video is cued, and changes when
                 the player swaps in a different one. */
              const duration = event.target.getDuration();
              if (duration > 0) setDurationSeconds(duration);

              if (state === ENDED) {
                setHasEnded(true);
                /* The tail is never polled — the player stops reporting once
                   it ends — so credit it here, or a video watched to the end
                   would sit just short of the bar. */
                if (duration > 0) progressRef.current?.(duration);
              }
            },
            onError: () => {
              if (cancelled) return;
              setError("This video lesson could not be played.");
            },
          },
        });

        playerRef.current = player;
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "The YouTube player could not be loaded.",
        );
      });

    return () => {
      cancelled = true;
      playerRef.current = null;

      try {
        player?.destroy();
      } catch {
        /* The API throws if it has already torn its own iframe down; the
           element is removed below either way. */
      }

      container.replaceChildren();
    };
  }, [container, videoId]);

  /**
   * Keeps the play head in step with the player, however it got there.
   *
   * Polled rather than driven by events because the IFrame API offers no seek
   * event — a scrub is simply the play head being somewhere it could not have
   * reached by playing. Polling continues while paused so that scrubbing a
   * paused video is still seen; it is only the rate that drops.
   *
   * Coverage is credited from playback alone. Moving the scrub bar changes
   * where the learner is without their having watched anything on the way, so
   * a seek updates the position and earns nothing — which is what stops
   * dragging to the end from finishing the lesson.
   */
  useEffect(() => {
    if (!isReady) return;

    const tick = () => {
      const player = playerRef.current;
      if (!player) return;

      let time: number;
      try {
        time = player.getCurrentTime();
      } catch {
        /* The player can be mid-teardown; the next tick will find it gone. */
        return;
      }

      if (!Number.isFinite(time) || time < 0) return;

      /* Unchanged while paused and untouched, so React bails out and this
         costs nothing between seeks. */
      setCurrentTime(time);

      if (isPlaying) progressRef.current?.(time);
    };

    tick();
    const timer = window.setInterval(tick, isPlaying ? POLL_MS : IDLE_POLL_MS);
    return () => window.clearInterval(timer);
  }, [isReady, isPlaying]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  }, [isPlaying]);

  return {
    containerRef: setContainer,
    isReady,
    isPlaying,
    hasEnded,
    durationSeconds,
    currentTime,
    error,
    toggle,
  };
}
