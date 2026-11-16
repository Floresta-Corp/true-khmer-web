import { useCallback, useEffect, useRef, useState } from "react";
import { facebookVideoHref } from "~/features/education/lib/video-source";
import type { LessonVideoPlayer } from "./use-youtube-player";

interface FacebookSubscription {
  release(event?: string): void;
}

interface FacebookVideoPlayer {
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  getCurrentPosition(): number;
  getDuration(): number;
  subscribe(
    event:
      | "startedPlaying"
      | "paused"
      | "finishedPlaying"
      | "startedBuffering"
      | "finishedBuffering"
      | "error",
    callback: (payload?: unknown) => void,
  ): FacebookSubscription;
}

interface XfbmlReadyMessage {
  type: string;
  id?: string;
  instance: FacebookVideoPlayer;
}

interface FacebookSdk {
  init(options: { xfbml?: boolean; version: string; appId?: string }): void;
  XFBML: { parse(element?: HTMLElement): void };
  Event: {
    subscribe(
      event: "xfbml.ready",
      callback: (message: XfbmlReadyMessage) => void,
    ): void;
    unsubscribe(
      event: "xfbml.ready",
      callback: (message: XfbmlReadyMessage) => void,
    ): void;
  };
}

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

const SDK_SRC = "https://connect.facebook.net/en_US/sdk.js";
const SDK_VERSION = "v21.0";

const POLL_MS = 400;

/* The narrowest the embedded video plugin renders. */
const MIN_WIDTH = 220;

const READY_TIMEOUT_MS = 20_000;

const UNPLAYABLE =
  "This Facebook video could not be played. It may not be public, or a browser extension may be blocking Facebook.";

let pendingSdk: Promise<FacebookSdk> | null = null;

function loadFacebookSdk(): Promise<FacebookSdk> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("The Facebook player needs a browser"));
  }
  if (pendingSdk) return pendingSdk;

  pendingSdk = new Promise<FacebookSdk>((resolve, reject) => {
    const ready = () => {
      const sdk = window.FB;
      if (!sdk) {
        pendingSdk = null;
        reject(new Error(UNPLAYABLE));
        return;
      }
      sdk.init({ xfbml: false, version: SDK_VERSION });
      resolve(sdk);
    };

    if (window.FB) {
      ready();
      return;
    }

    window.fbAsyncInit = ready;

    if (!document.getElementById("fb-root")) {
      const root = document.createElement("div");
      root.id = "fb-root";
      document.body.prepend(root);
    }

    const script = document.createElement("script");
    script.src = SDK_SRC;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      pendingSdk = null;
      script.remove();
      reject(new Error(UNPLAYABLE));
    };
    document.body.appendChild(script);
  });

  return pendingSdk;
}

let playerCount = 0;

export function useFacebookPlayer({
  videoId,
  startSeconds = 0,
  onProgress,
}: {
  videoId: string | null;
  startSeconds?: number;
  onProgress?: (seconds: number) => void;
}): LessonVideoPlayer {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const playerRef = useRef<FacebookVideoPlayer | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;
  const startRef = useRef(startSeconds);
  startRef.current = startSeconds;

  useEffect(() => {
    if (!container || !videoId) return;

    let cancelled = false;
    let sdk: FacebookSdk | null = null;
    const subscriptions: FacebookSubscription[] = [];
    let elementId = "";

    setIsReady(false);
    setIsPlaying(false);
    setHasEnded(false);
    setDurationSeconds(0);
    setCurrentTime(startRef.current);
    setError(null);

    const releaseSubscriptions = () => {
      for (const subscription of subscriptions.splice(0)) {
        try {
          subscription.release();
        } catch {
          continue;
        }
      }
    };
    const bounds = container.getBoundingClientRect();
    let width = Math.max(
      MIN_WIDTH,
      Math.floor(Math.min(bounds.width, (bounds.height * 16) / 9)),
    );
    let refitted = false;
    let resizeObserver: ResizeObserver | null = null;
    let readyTimer: number | undefined;

    const armReadyTimer = () => {
      window.clearTimeout(readyTimer);
      readyTimer = window.setTimeout(() => {
        if (!cancelled && !playerRef.current) setError(UNPLAYABLE);
      }, READY_TIMEOUT_MS);
    };

    const render = () => {
      elementId = `fb-video-lesson-${++playerCount}`;
      const mount = document.createElement("div");
      mount.id = elementId;
      mount.className = "fb-video shrink-0";
      mount.dataset.href = facebookVideoHref(videoId);
      mount.dataset.width = String(width);
      mount.dataset.allowfullscreen = "true";
      mount.dataset.showText = "false";
      mount.dataset.showCaptions = "true";
      container.replaceChildren(mount);

      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(() => {
        if (cancelled) return;
        const available = container.getBoundingClientRect().height;
        const height = mount.offsetHeight;
        if (height <= available + 1) {
          mount.style.transform = "";
          return;
        }

        if (!refitted) {
          refitted = true;
          const fitted = Math.max(
            MIN_WIDTH,
            Math.floor((width * available) / height),
          );
          if (fitted < width) {
            width = fitted;
            releaseSubscriptions();
            playerRef.current = null;
            setIsReady(false);
            setIsPlaying(false);
            render();
            armReadyTimer();
            sdk?.XFBML.parse(container);
            return;
          }
        }

        mount.style.transformOrigin = "center";
        mount.style.transform = `scale(${available / height})`;
      });
      resizeObserver.observe(mount);
      resizeObserver.observe(container);
    };

    render();

    armReadyTimer();

    const onReady = (message: XfbmlReadyMessage) => {
      if (cancelled || message.type !== "video" || message.id !== elementId) {
        return;
      }
      window.clearTimeout(readyTimer);

      const player = message.instance;
      playerRef.current = player;
      /* Ready after the timeout gave up on it: the video plays after all,
         so take back the error that is covering it. */
      setError(null);
      setIsReady(true);

      let resumed = startRef.current <= 0;

      subscriptions.push(
        player.subscribe("startedPlaying", () => {
          if (cancelled) return;
          setIsPlaying(true);
          setHasEnded(false);

          const length = player.getDuration();
          if (length > 0) setDurationSeconds(length);
          if (!resumed) {
            resumed = true;
            const start = startRef.current;
            if (!length || start < length) player.seek(start);
          }
        }),
        player.subscribe("paused", () => {
          if (cancelled) return;
          setIsPlaying(false);
          setCurrentTime(player.getCurrentPosition());
        }),
        player.subscribe("finishedPlaying", () => {
          if (cancelled) return;
          setIsPlaying(false);
          setHasEnded(true);
          const end = player.getDuration();
          if (end > 0) {
            setCurrentTime(end);
            progressRef.current?.(end);
          }
        }),
        player.subscribe("error", () => {
          if (cancelled) return;
          setError(UNPLAYABLE);
        }),
      );
    };

    loadFacebookSdk()
      .then((loaded) => {
        if (cancelled) return;
        sdk = loaded;
        loaded.Event.subscribe("xfbml.ready", onReady);
        loaded.XFBML.parse(container);
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        window.clearTimeout(readyTimer);
        setError(reason instanceof Error ? reason.message : UNPLAYABLE);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      sdk?.Event.unsubscribe("xfbml.ready", onReady);
      resizeObserver?.disconnect();
      releaseSubscriptions();
      playerRef.current = null;
      container.replaceChildren();
    };
  }, [container, videoId]);

  useEffect(() => {
    if (!isPlaying) return;

    const tick = () => {
      const player = playerRef.current;
      if (!player) return;

      const time = player.getCurrentPosition();
      if (!Number.isFinite(time)) return;
      setCurrentTime(time);
      progressRef.current?.(time);

      const length = player.getDuration();
      if (length > 0) setDurationSeconds(length);
    };

    tick();
    const timer = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pause();
    else player.play();
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
