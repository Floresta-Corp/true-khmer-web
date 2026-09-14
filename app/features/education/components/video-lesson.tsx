import type { ReactNode } from "react";
import { Youtube } from "lucide-react";
import { cn } from "~/lib/utils";
import { youtubeVideoId } from "~/features/education/lib/lesson-media";
import {
  timedLessonGate,
  unavailableLessonGate,
} from "~/features/education/lib/lesson-gate";
import { useWatchCoverage } from "~/features/education/hooks/use-watch-coverage";
import { useYouTubePlayer } from "~/features/education/hooks/use-youtube-player";
import { useReportLessonGate } from "~/features/education/hooks/use-report-lesson-gate";
import { mediaFrame, type LessonMediaProps } from "./lesson-media-frame";

/**
 * A YouTube lesson.
 *
 * Played through the IFrame Player API rather than a bare iframe, so the page
 * can see what happened: the seconds the learner really played are what opens
 * the next lesson. YouTube's own controls are left in place — reimplementing
 * play, seek and fullscreen over an API we are already polling would only add
 * a second set of buttons to keep in sync.
 */
export function VideoLesson(props: LessonMediaProps) {
  const { lesson } = props;
  const videoId = lesson.sourceUrl ? youtubeVideoId(lesson.sourceUrl) : null;

  if (!videoId) return <UnavailableVideoLesson {...props} />;
  return <PlayableVideoLesson {...props} videoId={videoId} />;
}

function VideoFrame({
  children,
  overlay,
  flush,
  tone = "black",
}: {
  children?: ReactNode;
  overlay?: ReactNode;
  flush?: boolean;
  tone?: "black" | "grey";
}) {
  return (
    <div
      className={cn(
        "relative h-65 overflow-hidden sm:h-115",
        tone === "black" ? "bg-black" : "bg-[#4A4A4A]",
        mediaFrame(flush),
      )}
    >
      {children}

      {overlay && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.35)_60%,transparent_100%)] px-5 pt-4 pb-8">
          <div className="pointer-events-auto">{overlay}</div>
        </div>
      )}
    </div>
  );
}

function PlayableVideoLesson({
  lesson,
  videoId,
  overlay,
  flush,
  resume,
  onGateChange,
}: LessonMediaProps & { videoId: string }) {
  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const player = useYouTubePlayer({
    videoId,
    startSeconds: resume?.positionSeconds ?? 0,
    onProgress: record,
  });

  /* The API's own duration is used where it has one. The creator's recorded
     `durationSeconds` is a fallback for the moment before the player reports,
     and can be wrong or absent — YouTube knows the real length. */
  const durationSeconds =
    player.durationSeconds > 0
      ? player.durationSeconds
      : (lesson.durationSeconds ?? 0);

  const gate = player.error
    ? unavailableLessonGate()
    : timedLessonGate({
        watchedSeconds,
        durationSeconds,
        positionSeconds: player.currentTime,
        hasEnded: player.hasEnded,
        isReady: player.isReady,
      });

  useReportLessonGate(gate, onGateChange);

  return (
    <VideoFrame overlay={overlay} flush={flush}>
      {/* The iframe is the API's, not React's, so it is sized from here. */}
      <div
        ref={player.containerRef}
        className="size-full [&_iframe]:size-full [&_iframe]:border-0"
      />

      {player.error && (
        <p className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-8 text-center text-sm text-white">
          {player.error}
        </p>
      )}
    </VideoFrame>
  );
}

/**
 * A video lesson whose link is not a YouTube video.
 *
 * Shown rather than a player, because there is nothing to play. The gate opens
 * so one bad link cannot strand a learner part-way through a course.
 */
function UnavailableVideoLesson({
  lesson,
  overlay,
  flush,
  onGateChange,
}: LessonMediaProps) {
  const gate = unavailableLessonGate();

  useReportLessonGate(gate, onGateChange);

  return (
    <VideoFrame overlay={overlay} flush={flush} tone="grey">
      {lesson.posterUrl && (
        <img src={lesson.posterUrl} alt="" className="size-full object-cover" />
      )}
      <div className="absolute inset-0 bg-[rgba(10,20,40,0.55)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white/95">
          <Youtube className="size-6.5 text-[#1C5DD4]" aria-hidden />
        </span>
        <p className="text-[15px] font-bold text-white">
          This video is unavailable
        </p>
        <p className="max-w-90 text-sm leading-[1.6] text-white/80">
          The link on this lesson is not a YouTube video. You can carry on to
          the next lesson.
        </p>
      </div>
    </VideoFrame>
  );
}
