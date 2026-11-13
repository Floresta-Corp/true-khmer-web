import { useRef, useState, type ReactNode } from "react";
import { Video } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  parseVideoSource,
  SUPPORTED_VIDEO_LINKS,
} from "~/features/education/lib/video-source";
import {
  timedLessonGate,
  unavailableLessonGate,
} from "~/features/education/lib/lesson-gate";
import { createSeekGuard } from "~/features/education/lib/seek-guard";
import { useWatchCoverage } from "~/features/education/hooks/use-watch-coverage";
import {
  useYouTubePlayer,
  type LessonVideoPlayer,
} from "~/features/education/hooks/use-youtube-player";
import { useVimeoPlayer } from "~/features/education/hooks/use-vimeo-player";
import { useTikTokPlayer } from "~/features/education/hooks/use-tiktok-player";
import { useFacebookPlayer } from "~/features/education/hooks/use-facebook-player";
import { useReportLessonGate } from "~/features/education/hooks/use-report-lesson-gate";
import { mediaFrame, type LessonMediaProps } from "./lesson-media-frame";

export function VideoLesson(props: LessonMediaProps) {
  const { lesson } = props;
  const source = lesson.sourceUrl ? parseVideoSource(lesson.sourceUrl) : null;

  switch (source?.platform) {
    case "youtube":
      return <YouTubeVideoLesson {...props} videoId={source.id} />;
    case "vimeo":
      return (
        <VimeoVideoLesson {...props} videoId={source.id} hash={source.hash} />
      );
    case "tiktok":
      return <TikTokVideoLesson {...props} videoId={source.id} />;
    case "facebook":
      return <FacebookVideoLesson {...props} videoId={source.id} />;
    case "file":
      return <FileVideoLesson {...props} src={source.url} />;
    default:
      return <UnavailableVideoLesson {...props} />;
  }
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

function YouTubeVideoLesson(props: LessonMediaProps & { videoId: string }) {
  const { lesson, videoId, resume } = props;
  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const player = useYouTubePlayer({
    videoId,
    startSeconds: resume?.positionSeconds ?? 0,
    onProgress: record,
  });

  return (
    <EmbeddedVideoLesson
      {...props}
      player={player}
      watchedSeconds={watchedSeconds}
    />
  );
}

function VimeoVideoLesson(
  props: LessonMediaProps & { videoId: string; hash: string | null },
) {
  const { lesson, videoId, hash, resume } = props;
  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const player = useVimeoPlayer({
    videoId,
    hash,
    startSeconds: resume?.positionSeconds ?? 0,
    onProgress: record,
  });

  return (
    <EmbeddedVideoLesson
      {...props}
      player={player}
      watchedSeconds={watchedSeconds}
    />
  );
}

function TikTokVideoLesson(props: LessonMediaProps & { videoId: string }) {
  const { lesson, videoId, resume } = props;
  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const player = useTikTokPlayer({
    videoId,
    startSeconds: resume?.positionSeconds ?? 0,
    onProgress: record,
  });

  return (
    <EmbeddedVideoLesson
      {...props}
      player={player}
      watchedSeconds={watchedSeconds}
      layout="portrait"
    />
  );
}

function FacebookVideoLesson(props: LessonMediaProps & { videoId: string }) {
  const { lesson, videoId, resume } = props;
  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const player = useFacebookPlayer({
    videoId,
    startSeconds: resume?.positionSeconds ?? 0,
    onProgress: record,
  });

  return (
    <EmbeddedVideoLesson
      {...props}
      player={player}
      watchedSeconds={watchedSeconds}
      layout="plugin"
    />
  );
}

const PLAYER_LAYOUT = {
  fill: "size-full [&_iframe]:size-full [&_iframe]:border-0",
  portrait:
    "mx-auto aspect-9/16 h-full max-w-full [&_iframe]:size-full [&_iframe]:border-0",
  plugin: "flex size-full items-center justify-center overflow-hidden",
} as const;

function EmbeddedVideoLesson({
  lesson,
  overlay,
  flush,
  onGateChange,
  player,
  watchedSeconds,
  layout = "fill",
}: LessonMediaProps & {
  player: LessonVideoPlayer;
  watchedSeconds: number;
  layout?: keyof typeof PLAYER_LAYOUT;
}) {
  const durationSeconds =
    player.durationSeconds > 0
      ? player.durationSeconds
      : (lesson.durationSeconds ?? 0);

  const gate = player.error
    ? unavailableLessonGate()
    : timedLessonGate({
        watchedSeconds,
        durationSeconds,
        recordedDurationSeconds: lesson.durationSeconds,
        positionSeconds: player.currentTime,
        hasEnded: player.hasEnded,
        isReady: player.isReady,
      });

  useReportLessonGate(gate, onGateChange);

  return (
    <VideoFrame overlay={overlay} flush={flush}>
      <div ref={player.containerRef} className={PLAYER_LAYOUT[layout]} />

      {player.error && (
        <p className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-8 text-center text-sm text-white">
          {player.error}
        </p>
      )}
    </VideoFrame>
  );
}

function FileVideoLesson({
  lesson,
  src,
  overlay,
  flush,
  resume,
  onGateChange,
}: LessonMediaProps & { src: string }) {
  const [currentTime, setCurrentTime] = useState(resume?.positionSeconds ?? 0);
  const [duration, setDuration] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const seekGuard = useRef(createSeekGuard());

  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const startSeconds = resume?.positionSeconds ?? 0;

  const durationSeconds =
    duration > 0 ? duration : (lesson.durationSeconds ?? 0);

  const gate = isBroken
    ? unavailableLessonGate()
    : timedLessonGate({
        watchedSeconds,
        durationSeconds,
        recordedDurationSeconds: lesson.durationSeconds,
        positionSeconds: currentTime,
        hasEnded,
        isReady: durationSeconds > 0,
      });

  useReportLessonGate(gate, onGateChange);

  return (
    <VideoFrame overlay={overlay} flush={flush}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        poster={lesson.posterUrl ?? undefined}
        controlsList="nodownload"
        className="size-full object-contain"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);

          if (startSeconds > 0 && startSeconds < value) {
            event.currentTarget.currentTime = startSeconds;
            setCurrentTime(startSeconds);
          }
        }}
        onTimeUpdate={(event) => {
          const time = event.currentTarget.currentTime;
          setCurrentTime(time);
          /* A seek while playing also fires this; landing somewhere is not
             having watched it. */
          if (!event.currentTarget.paused && seekGuard.current.credits(time)) {
            record(time);
          }
        }}
        onSeeking={() => seekGuard.current.seeking()}
        onSeeked={(event) => {
          const time = event.currentTarget.currentTime;
          seekGuard.current.seeked(time);
          setCurrentTime(time);
        }}
        onEnded={(event) => {
          setHasEnded(true);
          record(event.currentTarget.currentTime);
        }}
        onError={() => setIsBroken(true)}
      >
        Your browser cannot play this video.
      </video>

      {isBroken && (
        <p className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-8 text-center text-sm text-white">
          This video lesson could not be played. You can carry on to the next
          lesson.
        </p>
      )}
    </VideoFrame>
  );
}

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
          <Video className="size-6.5 text-[#1C5DD4]" aria-hidden />
        </span>
        <p className="text-[15px] font-bold text-white">
          This video is unavailable
        </p>
        <p className="max-w-90 text-sm leading-[1.6] text-white/80">
          The link on this lesson is not {SUPPORTED_VIDEO_LINKS}. You can carry
          on to the next lesson.
        </p>
      </div>
    </VideoFrame>
  );
}
