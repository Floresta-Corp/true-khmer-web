import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { cn } from "~/lib/utils";
import { youtubeEmbedUrl } from "~/features/education/lib/lesson-media";
import { mediaFrame, type LessonMediaProps } from "./lesson-media-frame";

export function VideoLesson({ lesson, overlay, flush }: LessonMediaProps) {
  const embedUrl = lesson.sourceUrl ? youtubeEmbedUrl(lesson.sourceUrl) : null;

  if (embedUrl) {
    return (
      <div
        className={cn(
          "relative h-65 overflow-hidden bg-black sm:h-115",
          mediaFrame(flush),
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

function SimulatedVideoLesson({ lesson, overlay, flush }: LessonMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () =>
      setIsFullscreen(document.fullscreenElement === containerRef.current);

    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = async () => {
    const element = containerRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      setIsFullscreen(document.fullscreenElement === element);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-65 overflow-hidden bg-[#4A4A4A] sm:h-115",
        mediaFrame(flush),
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
