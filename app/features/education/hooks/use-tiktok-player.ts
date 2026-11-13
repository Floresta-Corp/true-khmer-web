import { useCallback, useEffect, useRef, useState } from "react";
import type { LessonVideoPlayer } from "./use-youtube-player";

const PLAYER_ORIGIN = "https://www.tiktok.com";

const STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2 } as const;

const PLAYER_PARAMS = new URLSearchParams({
  controls: "1",
  progress_bar: "1",
  play_button: "1",
  volume_control: "1",
  fullscreen_button: "1",
  timestamp: "1",
  loop: "0",
  autoplay: "0",
  music_info: "0",
  description: "0",
  rel: "0",
  native_context_menu: "0",
  closed_caption: "1",
});

function tiktokPlayerUrl(videoId: string) {
  return `${PLAYER_ORIGIN}/player/v1/${videoId}?${PLAYER_PARAMS}`;
}

interface PlayerMessage {
  "x-tiktok-player"?: boolean;
  type?: string;
  value?: unknown;
}

function readMessage(data: unknown): PlayerMessage | null {
  let message: unknown = data;
  if (typeof data === "string") {
    try {
      message = JSON.parse(data);
    } catch {
      return null;
    }
  }
  if (typeof message !== "object" || message === null) return null;
  const typed = message as PlayerMessage;
  return typed["x-tiktok-player"] ? typed : null;
}

export function useTikTokPlayer({
  videoId,
  startSeconds = 0,
  onProgress,
}: {
  videoId: string | null;
  startSeconds?: number;
  onProgress?: (seconds: number) => void;
}): LessonVideoPlayer {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

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

  const send = useCallback((type: string, value?: number) => {
    frameRef.current?.contentWindow?.postMessage(
      { "x-tiktok-player": true, type, value },
      PLAYER_ORIGIN,
    );
  }, []);

  useEffect(() => {
    if (!container || !videoId) return;

    let playing = false;
    let duration = 0;
    let resumed = startRef.current <= 0;

    setIsReady(false);
    setIsPlaying(false);
    setHasEnded(false);
    setDurationSeconds(0);
    setCurrentTime(startRef.current);
    setError(null);

    const frame = document.createElement("iframe");
    frame.src = tiktokPlayerUrl(videoId);
    frame.title = "TikTok video lesson";
    frame.allow = "autoplay; fullscreen; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    frame.className = "size-full border-0";
    container.replaceChildren(frame);
    frameRef.current = frame;

    const readyTimer = window.setTimeout(() => {
      setError(
        "This TikTok video could not be played. It may be private, removed, or not allowed to be embedded.",
      );
    }, 20_000);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== PLAYER_ORIGIN) return;
      if (event.source !== frame.contentWindow) return;
      const message = readMessage(event.data);
      if (!message) return;

      switch (message.type) {
        case "onPlayerReady":
          window.clearTimeout(readyTimer);
          /* Ready after the timeout gave up on it: the video plays after all,
             so take back the error that is covering it. */
          setError(null);
          setIsReady(true);
          break;

        case "onStateChange": {
          const state = message.value;
          if (state === STATE.PLAYING) {
            playing = true;
            setIsPlaying(true);
            setHasEnded(false);
            if (!resumed) {
              resumed = true;
              const start = startRef.current;
              if (!duration || start < duration) send("seekTo", start);
            }
          } else if (state === STATE.PAUSED) {
            playing = false;
            setIsPlaying(false);
          } else if (state === STATE.ENDED) {
            playing = false;
            setIsPlaying(false);
            setHasEnded(true);
            if (duration > 0) progressRef.current?.(duration);
          }
          break;
        }

        case "onCurrentTime": {
          const value = message.value as
            | { currentTime?: unknown; duration?: unknown }
            | undefined;
          const time = Number(value?.currentTime);
          const length = Number(value?.duration);
          if (Number.isFinite(length) && length > 0) {
            duration = length;
            setDurationSeconds(length);
          }
          if (Number.isFinite(time)) {
            setCurrentTime(time);
            if (playing) progressRef.current?.(time);
          }
          break;
        }

        case "onPlayerError":
          window.clearTimeout(readyTimer);
          setError(
            "This TikTok video could not be played. It may be private, removed, or not allowed to be embedded.",
          );
          break;
      }
    };

    window.addEventListener("message", onMessage);

    return () => {
      window.clearTimeout(readyTimer);
      window.removeEventListener("message", onMessage);
      frameRef.current = null;
      container.replaceChildren();
    };
  }, [container, videoId, send]);

  const toggle = useCallback(() => {
    send(isPlaying ? "pause" : "play");
  }, [isPlaying, send]);

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
