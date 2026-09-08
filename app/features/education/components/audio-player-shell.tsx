import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "~/lib/utils";
import { useWaveformBars } from "~/features/education/hooks/use-waveform-bars";
import { mediaFrame } from "./lesson-media-frame";

export interface AudioPlayerShellProps {
  isPlaying: boolean;
  onToggle: () => void;
  progress: number;
  onSeek?: (ratio: number) => void;
  onScrub?: (ratio: number) => void;
  durationSeconds?: number;
  elapsed: string;
  duration: string;
  flush?: boolean;
}

const clampRatio = (ratio: number) => Math.min(1, Math.max(0, ratio));

const KEYBOARD_STEP_SECONDS = 5;

export function AudioPlayerShell({
  isPlaying,
  onToggle,
  progress,
  onSeek,
  onScrub,
  durationSeconds,
  elapsed,
  duration,
  flush,
}: AudioPlayerShellProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const bars = useWaveformBars(trackRef);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const preview = onScrub ?? onSeek;

  const ratioFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return null;

    const { left, width } = track.getBoundingClientRect();
    if (width <= 0) return null;
    return clampRatio((clientX - left) / width);
  };

  const startScrub = (event: PointerEvent<HTMLDivElement>) => {
    if (!onSeek || event.button !== 0) return;

    const ratio = ratioFromPointer(event.clientX);
    if (ratio === null) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsScrubbing(true);
    preview?.(ratio);
  };

  const moveScrub = (event: PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;

    const ratio = ratioFromPointer(event.clientX);
    if (ratio !== null) preview?.(ratio);
  };

  const endScrub = (event: PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;

    setIsScrubbing(false);
    onSeek?.(ratioFromPointer(event.clientX) ?? progress);
  };

  const nudgeSeconds = (seconds: number) => {
    if (!onSeek) return;

    const delta =
      durationSeconds && durationSeconds > 0
        ? seconds / durationSeconds
        : Math.sign(seconds) * 0.02;

    onSeek(clampRatio(progress + delta));
  };

  return (
    <div
      className={cn(
        "flex items-center border border-gray-200 bg-white p-8",
        mediaFrame(flush),
      )}
    >
      <div className="flex w-full items-center gap-6">
        <button
          type="button"
          aria-label={isPlaying ? "Pause lesson" : "Play lesson"}
          onClick={onToggle}
          className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1C5DD4] text-white transition-colors hover:bg-[#174FB4]"
        >
          {isPlaying ? (
            <Pause className="size-5.5 fill-current" aria-hidden />
          ) : (
            <Play className="ml-0.5 size-5.5 fill-current" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div
            ref={trackRef}
            role={onSeek ? "slider" : undefined}
            tabIndex={onSeek ? 0 : undefined}
            aria-label={onSeek ? "Seek" : undefined}
            aria-valuemin={onSeek ? 0 : undefined}
            aria-valuemax={onSeek ? 100 : undefined}
            aria-valuenow={onSeek ? Math.round(progress * 100) : undefined}
            aria-valuetext={onSeek ? `${elapsed} of ${duration}` : undefined}
            onPointerDown={onSeek ? startScrub : undefined}
            onPointerMove={onSeek ? moveScrub : undefined}
            onPointerUp={onSeek ? endScrub : undefined}
            onPointerCancel={onSeek ? endScrub : undefined}
            onKeyDown={
              onSeek
                ? (event) => {
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      nudgeSeconds(KEYBOARD_STEP_SECONDS);
                    } else if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      nudgeSeconds(-KEYBOARD_STEP_SECONDS);
                    } else if (event.key === "Home") {
                      event.preventDefault();
                      onSeek(0);
                    } else if (event.key === "End") {
                      event.preventDefault();
                      onSeek(1);
                    }
                  }
                : undefined
            }
            className={cn(
              "mb-3 flex h-11 items-end",
              onSeek &&
                "cursor-pointer touch-none outline-none select-none focus-visible:ring-2 focus-visible:ring-[#1C5DD4]/40",
            )}
          >
            {bars.map((bar, index) => (
              <div
                key={bar.id}
                className="flex flex-1 justify-center"
                style={{ height: `${bar.heightPercent}%` }}
              >
                <div
                  className={cn(
                    "w-3/5 rounded-[3px]",
                    index / bars.length < progress
                      ? "bg-[#1C5DD4]"
                      : "bg-[#D4D4D8]",
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#9A9AB0] tabular-nums">
            <span>{elapsed}</span>
            <span>{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
