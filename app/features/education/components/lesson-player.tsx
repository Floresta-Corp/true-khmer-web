import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { cn, getSafeExternalUrl } from "~/lib/utils";
import type { ActiveLesson } from "~/features/education/types";

export function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    const id =
      host === "youtu.be"
        ? parsed.pathname.slice(1)
        : host.endsWith("youtube.com")
          ? (parsed.searchParams.get("v") ??
            parsed.pathname.match(/^\/(?:embed|shorts|v)\/([^/?]+)/)?.[1] ??
            null)
          : null;

    return id ? `https://www.youtube.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

interface LessonPlayerProps {
  lesson: ActiveLesson;
  overlay?: ReactNode;
  flush?: boolean;
}

export function LessonPlayer({ lesson, overlay, flush }: LessonPlayerProps) {
  if (lesson.type === "pdf")
    return <PdfLesson lesson={lesson} overlay={overlay} flush={flush} />;
  if (lesson.type === "audio")
    return <AudioLesson lesson={lesson} overlay={overlay} flush={flush} />;
  return <VideoLesson lesson={lesson} overlay={overlay} flush={flush} />;
}

const frame = (flush?: boolean) => (flush ? "" : "rounded-xl");

function VideoLesson({ lesson, overlay, flush }: LessonPlayerProps) {
  const embedUrl = lesson.sourceUrl ? youtubeEmbedUrl(lesson.sourceUrl) : null;

  if (embedUrl) {
    return (
      <div
        className={cn(
          "relative h-65 overflow-hidden bg-black sm:h-115",
          frame(flush),
        )}
      >
        <iframe
          src={embedUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full border-0"
        />

        {overlay && (
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.35)_60%,transparent_100%)] px-5 pt-4 pb-8">
            <div className="pointer-events-auto">{overlay}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <SimulatedVideoLesson lesson={lesson} overlay={overlay} flush={flush} />
  );
}

function SimulatedVideoLesson({ lesson, overlay, flush }: LessonPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    const element = containerRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      await element.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-65 overflow-hidden bg-[#4A4A4A] sm:h-115",
        frame(flush),
      )}
    >
      {lesson.posterUrl && (
        <img src={lesson.posterUrl} alt="" className="size-full object-cover" />
      )}
      <div className="absolute inset-0 bg-[rgba(10,20,40,0.42)]" />

      {overlay && (
        <div className="absolute inset-x-0 top-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.35)_60%,transparent_100%)] px-5 pt-4 pb-8">
          {overlay}
        </div>
      )}

      <button
        type="button"
        aria-label={isPlaying ? "Pause lesson" : "Play lesson"}
        onClick={() => setIsPlaying((value) => !value)}
        className="absolute top-1/2 left-1/2 flex size-18.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 transition-transform hover:scale-105"
      >
        {isPlaying ? (
          <Pause
            className="size-6.5 fill-[#1C5DD4] text-[#1C5DD4]"
            aria-hidden
          />
        ) : (
          <Play
            className="ml-1 size-6.5 fill-[#1C5DD4] text-[#1C5DD4]"
            aria-hidden
          />
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3.5 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.6)_100%)] px-5 py-4.5">
        <span className="text-xs text-white tabular-nums">
          {lesson.elapsed}
        </span>
        <div className="h-1 flex-1 overflow-hidden rounded-sm bg-white/35">
          <div className="h-full w-0 rounded-sm bg-white" />
        </div>
        <span className="text-xs text-white/85 tabular-nums">
          {lesson.duration}
        </span>
        <button
          type="button"
          aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
          onClick={toggleFullscreen}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center"
        >
          {isFullscreen ? (
            <Minimize2 className="size-4.25 text-white" aria-hidden />
          ) : (
            <Maximize2 className="size-4.25 text-white" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}

function PdfLesson({ lesson, overlay, flush }: LessonPlayerProps) {
  const src = getSafeExternalUrl(lesson.sourceUrl);

  if (src) {
    return (
      <div>
        {overlay && <MediaBar>{overlay}</MediaBar>}
        <div
          className={cn(
            "h-115 overflow-hidden border border-gray-200 bg-[#E8E8E8]",
            frame(flush),
          )}
        >
          <iframe
            src={src}
            title={lesson.title}
            sandbox="allow-scripts allow-same-origin"
            className="size-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {overlay && <MediaBar>{overlay}</MediaBar>}
      <SimulatedPdfLesson flush={flush} />
    </div>
  );
}

/**
 * The title strip above an audio or PDF lesson.
 *
 * Grey to match the design. The overlay's title stays white on it, which is
 * about 1.9:1 — below the 4.5:1 WCAG AA needs for body text — so if the title
 * is ever reported as hard to read, darkening the text rather than the bar is
 * the fix that keeps this tone.
 */
function MediaBar({ children }: { children: ReactNode }) {
  return <div className="bg-[#C4C4CA] px-5 py-4">{children}</div>;
}

function SimulatedPdfLesson({ flush }: { flush?: boolean }) {
  const lines = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        id: index,
        width: index % 4 === 3 ? "62%" : index % 3 === 0 ? "94%" : "100%",
      })),
    [],
  );

  return (
    <div
      className={cn(
        "h-97.5 overflow-y-auto border border-gray-200 bg-[#E8E8E8] [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]",
        frame(flush),
      )}
    >
      <div className="flex justify-center p-8">
        <div className="flex aspect-[1/1.294] w-full max-w-130 shrink-0 flex-col gap-3.5 border border-gray-200 bg-white px-10 py-11 shadow-[0_4px_16px_rgba(26,26,46,0.08)]">
          <div className="h-px bg-gray-200" />
          {lines.map((line) => (
            <div
              key={line.id}
              className="h-2.5 rounded-sm bg-[#E8E8E8]"
              style={{ width: line.width }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Roughly the width one bar and its gap occupy, taken from the design.
 *
 * The count is derived from this rather than fixed, so the waveform keeps the
 * same density whatever the player is sized to: a fixed 48 bars spread across
 * a full-width player stretches each one into a blob, and cramps them on a
 * phone.
 */
const WAVEFORM_BAR_PITCH = 18;
const MIN_WAVEFORM_BARS = 24;
const MAX_WAVEFORM_BARS = 160;

/**
 * A deterministic pseudo-random value in [0, 1) for a bar index.
 *
 * A plain sine repeats often enough to be visible as a pattern across a wide
 * player; hashing the index gives the irregular look of a real waveform while
 * staying stable between renders, so the bars do not dance on every tick.
 */
function barNoise(index: number): number {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * The bar heights behind the waveform, as a share of the track's height.
 *
 * Synthesized rather than read from the file's real amplitudes: sampling those
 * would mean downloading and decoding the whole track before the learner
 * pressed play, and the waveform here is an affordance for scrubbing, not an
 * analysis.
 */
function useWaveformBars(ref: React.RefObject<HTMLElement | null>) {
  const [count, setCount] = useState(48);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (width <= 0) return;

      setCount(
        Math.min(
          MAX_WAVEFORM_BARS,
          Math.max(MIN_WAVEFORM_BARS, Math.round(width / WAVEFORM_BAR_PITCH)),
        ),
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        /* 18% to 100% of the track: a far wider spread than the design's
           predecessor, which sat between 55% and 100% and so read as a row of
           near-identical pills rather than a waveform. */
        heightPercent: 18 + barNoise(index) * 82,
      })),
    [count],
  );
}

/** Seconds to `m:ss`, or `h:mm:ss` once the track runs past an hour. */
function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}

interface AudioPlayerShellProps {
  isPlaying: boolean;
  onToggle: () => void;
  /** How far through the track, 0 to 1. */
  progress: number;
  /** Absent on the placeholder, where there is nothing to seek through. */
  onSeek?: (ratio: number) => void;
  elapsed: string;
  duration: string;
  flush?: boolean;
}

/**
 * The audio lesson's look: play button, waveform, and the two timestamps.
 *
 * Shared by the real player and the placeholder so a course with an uploaded
 * file and one without look like the same lesson — the difference is only
 * whether the controls do anything.
 */
function AudioPlayerShell({
  isPlaying,
  onToggle,
  progress,
  onSeek,
  elapsed,
  duration,
  flush,
}: AudioPlayerShellProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const bars = useWaveformBars(trackRef);

  const seekFromPointer = (clientX: number) => {
    const track = trackRef.current;
    if (!track || !onSeek) return;

    const { left, width } = track.getBoundingClientRect();
    if (width <= 0) return;
    onSeek(Math.min(1, Math.max(0, (clientX - left) / width)));
  };

  const nudge = (delta: number) => {
    if (!onSeek) return;
    onSeek(Math.min(1, Math.max(0, progress + delta)));
  };

  return (
    <div
      className={cn(
        "flex items-center border border-gray-200 bg-white p-8",
        frame(flush),
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
            onClick={
              onSeek ? (event) => seekFromPointer(event.clientX) : undefined
            }
            onKeyDown={
              onSeek
                ? (event) => {
                    if (event.key === "ArrowRight") {
                      event.preventDefault();
                      nudge(0.02);
                    } else if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      nudge(-0.02);
                    }
                  }
                : undefined
            }
            className={cn(
              "mb-3 flex h-11 items-end",
              onSeek &&
                "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1C5DD4]/40",
            )}
          >
            {/* Each bar sits centred in an equal-width cell and takes a fixed
                share of it, so bar and gap stay in step at any width. A fixed
                pixel gap cannot: the gap this spacing needs would overflow a
                phone-width player and collapse the bars to nothing. */}
            {bars.map((bar, index) => (
              <div
                key={bar.id}
                className="flex flex-1 justify-center"
                style={{ height: `${bar.heightPercent}%` }}
              >
                <div
                  /* The played portion is filled in as the track advances, so
                     the waveform doubles as the progress bar. */
                  className={cn(
                    /* A fixed 3px radius rather than `rounded-full`: on a bar
                       this narrow a full radius rounds most of its length into
                       a capsule, which reads as a row of pills instead of a
                       waveform. Softened ends, square sides. */
                    "w-3/5 rounded-[3px]",
                    /* Neutral grey unplayed, not a tinted blue: the design
                       keeps the blue for what has actually been listened to,
                       so a tinted track reads as already part-played. */
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

function AudioLesson({ lesson, overlay, flush }: LessonPlayerProps) {
  const src = getSafeExternalUrl(lesson.sourceUrl);

  return (
    <div>
      {overlay && <MediaBar>{overlay}</MediaBar>}
      {src ? (
        <RealAudioLesson lesson={lesson} src={src} flush={flush} />
      ) : (
        <SimulatedAudioLesson lesson={lesson} flush={flush} />
      )}
    </div>
  );
}

/**
 * An uploaded audio lesson, played through the lesson's own controls.
 *
 * A bare `<audio controls>` would drop the browser's default grey bar into the
 * middle of the course page; this drives a hidden element from the designed
 * player instead, so an audio lesson looks like part of the course the way a
 * video one does.
 */
function RealAudioLesson({
  lesson,
  src,
  flush,
}: {
  lesson: ActiveLesson;
  src: string;
  flush?: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* Moving to another lesson swaps the source under the same element, so the
     old track's position and play state have to be cleared by hand. */
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      /* Autoplay policies can refuse the call; the promise rejecting is the
         only signal, and without catching it the button would latch to
         "playing" over a track that never started. */
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const seek = (ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(duration) || duration <= 0) return;

    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      >
        Your browser cannot play this audio.
      </audio>

      <AudioPlayerShell
        isPlaying={isPlaying}
        onToggle={toggle}
        progress={progress}
        onSeek={seek}
        elapsed={formatClock(currentTime)}
        /* The curriculum's own figure stands in until the file reports its
           length, so the lesson does not flash "0:00" while metadata loads. */
        duration={duration > 0 ? formatClock(duration) : lesson.duration}
        flush={flush}
      />
    </>
  );
}

/** The same player for a lesson with no file attached yet. */
function SimulatedAudioLesson({
  lesson,
  flush,
}: {
  lesson: ActiveLesson;
  flush?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AudioPlayerShell
      isPlaying={isPlaying}
      onToggle={() => setIsPlaying((value) => !value)}
      progress={0}
      elapsed={lesson.elapsed}
      duration={lesson.duration}
      flush={flush}
    />
  );
}
