import { useCallback, useEffect, useRef, useState } from "react";
import type { LessonVideoPlayer } from "./use-youtube-player";

interface VimeoTimeEvent {
  seconds: number;
  duration: number;
}

interface VimeoPlayer {
  on(event: "loaded", callback: () => void): void;
  on(event: "play" | "pause", callback: () => void): void;
  on(
    event: "timeupdate" | "seeked" | "ended",
    callback: (event: VimeoTimeEvent) => void,
  ): void;
  on(event: "error", callback: (error: { name?: string }) => void): void;
  ready(): Promise<void>;
  getDuration(): Promise<number>;
  setCurrentTime(seconds: number): Promise<number>;
  play(): Promise<void>;
  pause(): Promise<void>;
  destroy(): Promise<void>;
}

interface VimeoApi {
  Player: new (
    element: HTMLElement,
    options: {
      url: string;
      width?: number;
      responsive?: boolean;
      dnt?: boolean;
      playsinline?: boolean;
      title?: boolean;
      byline?: boolean;
      portrait?: boolean;
    },
  ) => VimeoPlayer;
}

declare global {
  interface Window {
    Vimeo?: VimeoApi;
  }
}

const PLAYER_SDK_SRC = "https://player.vimeo.com/api/player.js";

let pendingApi: Promise<VimeoApi> | null = null;

function loadVimeoApi(): Promise<VimeoApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("The Vimeo player needs a browser"));
  }

  if (window.Vimeo?.Player) return Promise.resolve(window.Vimeo);
  if (pendingApi) return pendingApi;

  pendingApi = new Promise<VimeoApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLAYER_SDK_SRC;
    script.async = true;
    script.onload = () => {
      const api = window.Vimeo;
      if (api?.Player) {
        resolve(api);
      } else {
        pendingApi = null;
        reject(new Error("The Vimeo player did not load"));
      }
    };
    script.onerror = () => {
      pendingApi = null;
      reject(new Error("The Vimeo player could not be loaded"));
    };

    document.head.appendChild(script);
  });

  return pendingApi;
}

export function useVimeoPlayer({
  videoId,
  hash,
  startSeconds = 0,
  onProgress,
}: {
  videoId: string | null;
  hash: string | null;
  startSeconds?: number;
  onProgress?: (seconds: number) => void;
}): LessonVideoPlayer {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);

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
    let player: VimeoPlayer | null = null;
    let playing = false;

    setIsReady(false);
    setIsPlaying(false);
    setHasEnded(false);
    setDurationSeconds(0);
    setCurrentTime(startRef.current);
    setError(null);

    const mount = document.createElement("div");
    mount.className = "size-full";
    container.replaceChildren(mount);

    loadVimeoApi()
      .then((api) => {
        if (cancelled) return;

        player = new api.Player(mount, {
          url: hash
            ? `https://vimeo.com/${videoId}/${hash}`
            : `https://vimeo.com/${videoId}`,
          dnt: true,
          playsinline: true,
          title: false,
          byline: false,
          portrait: false,
        });
        playerRef.current = player;

        const active = player;

        active.on("loaded", () => {
          if (cancelled) return;
          setIsReady(true);

          void active.getDuration().then((duration) => {
            if (cancelled) return;
            if (duration > 0) setDurationSeconds(duration);

            const start = startRef.current;
            if (start > 0 && (!duration || start < duration)) {
              void active.setCurrentTime(start).catch(() => undefined);
            }
          });
        });

        active.on("play", () => {
          if (cancelled) return;
          playing = true;
          setIsPlaying(true);
        });

        active.on("pause", () => {
          if (cancelled) return;
          playing = false;
          setIsPlaying(false);
        });

        active.on("timeupdate", ({ seconds, duration }) => {
          if (cancelled) return;
          setCurrentTime(seconds);
          if (duration > 0) setDurationSeconds(duration);
          if (playing) progressRef.current?.(seconds);
        });

        active.on("seeked", ({ seconds }) => {
          if (cancelled) return;
          setCurrentTime(seconds);
        });

        active.on("ended", ({ duration }) => {
          if (cancelled) return;
          playing = false;
          setIsPlaying(false);
          setHasEnded(true);
          if (duration > 0) progressRef.current?.(duration);
        });

        active.on("error", () => {
          if (cancelled) return;
          setError("This video lesson could not be played.");
        });

        active.ready().catch(() => {
          if (cancelled) return;
          setError(
            "This Vimeo video could not be played. It may be private or not allowed to be embedded.",
          );
        });
      })
      .catch((reason: unknown) => {
        if (cancelled) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "The Vimeo player could not be loaded.",
        );
      });

    return () => {
      cancelled = true;
      playerRef.current = null;
      void player?.destroy().catch(() => undefined);
      container.replaceChildren();
    };
  }, [container, videoId, hash]);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    void (isPlaying ? player.pause() : player.play()).catch(() => undefined);
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
