import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { cn, getSafeExternalUrl } from "~/lib/utils";
import type { ActiveLesson } from "~/features/education/types";

/** youtu.be/ID, /watch?v=ID, /embed/ID and /shorts/ID all reduce to an id. */
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

/**
 * Renders the lesson body for the three media kinds in the design.
 *
 * A lesson with a real source plays it — a YouTube embed, an audio element, or
 * the PDF itself. A lesson saved before its media was uploaded has none, and
 * the design's presentational transport is shown instead.
 */
interface LessonPlayerProps {
  lesson: ActiveLesson;
  /**
   * The design's floating controls over the media — lesson title plus the save,
   * panel and overflow buttons. Laid over the video; a bar above pdf and audio.
   */
  overlay?: ReactNode;
  /** Flush against the shell, as the full-bleed learning screen requires. */
  flush?: boolean;
}

export function LessonPlayer({ lesson, overlay, flush }: LessonPlayerProps) {
  if (lesson.type === "pdf")
    return <PdfLesson lesson={lesson} overlay={overlay} flush={flush} />;
  if (lesson.type === "audio")
    return <AudioLesson lesson={lesson} overlay={overlay} flush={flush} />;
  return <VideoLesson lesson={lesson} overlay={overlay} flush={flush} />;
}

/** Rounded on the standalone screens, square when flush in the learn shell. */
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

        {/* The same top layer the simulated player draws. Dropping it here
            took the lesson title, Share, Report and the button that reopens
            the content panel off every real YouTube lesson. */}
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
  // The creator supplies this url, so it is framed only if it is a web
  // address, and sandboxed either way: a document served from storage needs no
  // more than its own scripts, and must not navigate the learner away.
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

/** The dark strip the design puts above pdf and audio lessons. */
function MediaBar({ children }: { children: ReactNode }) {
  return <div className="bg-[#2B2B3C] px-5 py-4">{children}</div>;
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

function AudioLesson({ lesson, overlay, flush }: LessonPlayerProps) {
  const src = getSafeExternalUrl(lesson.sourceUrl);

  if (src) {
    return (
      <div>
        {overlay && <MediaBar>{overlay}</MediaBar>}
        <div
          className={cn("border border-gray-200 bg-white p-8", frame(flush))}
        >
          <p className="mb-4 text-sm font-bold text-[#1A1A2E]">
            {lesson.title}
          </p>
          <audio controls preload="metadata" src={src} className="w-full">
            Your browser cannot play this audio.
          </audio>
        </div>
      </div>
    );
  }

  return (
    <div>
      {overlay && <MediaBar>{overlay}</MediaBar>}
      <SimulatedAudioLesson lesson={lesson} flush={flush} />
    </div>
  );
}

function SimulatedAudioLesson({
  lesson,
  flush,
}: {
  lesson: ActiveLesson;
  flush?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Deterministic bar heights so the waveform is stable across renders.
  const bars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => ({
        id: index,
        height: 24 + Math.round(Math.abs(Math.sin(index * 1.7)) * 20),
      })),
    [],
  );

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
          onClick={() => setIsPlaying((value) => !value)}
          className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1C5DD4] text-white transition-colors hover:bg-[#174FB4]"
        >
          {isPlaying ? (
            <Pause className="size-5.5 fill-current" aria-hidden />
          ) : (
            <Play className="ml-0.5 size-5.5 fill-current" aria-hidden />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex h-11 items-end gap-0.75" aria-hidden>
            {bars.map((bar) => (
              <div
                key={bar.id}
                className="flex-1 rounded-full bg-[#D5E2FA]"
                style={{ height: `${bar.height}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-[#9A9AB0] tabular-nums">
            <span>{lesson.elapsed}</span>
            <span>{lesson.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
