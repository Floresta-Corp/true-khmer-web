import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getSafeExternalUrl } from "~/lib/utils";
import type {
  ActiveLesson,
  LessonGateState,
  LessonResumePoint,
} from "~/features/education/types";
import { formatClock } from "~/features/education/lib/lesson-media";
import {
  timedLessonGate,
  unavailableLessonGate,
} from "~/features/education/lib/lesson-gate";
import { useWatchCoverage } from "~/features/education/hooks/use-watch-coverage";
import { useReportLessonGate } from "~/features/education/hooks/use-report-lesson-gate";
import { AudioPlayerShell } from "./audio-player-shell";
import { MediaBar, type LessonMediaProps } from "./lesson-media-frame";

/**
 * An audio lesson.
 *
 * Gated the same way as a video, and for the same reason: `timeupdate` is the
 * element's own account of where it is, so the seconds it actually played can
 * be counted. Scrubbing to the end therefore does not finish the lesson —
 * only playing it does.
 */
export function AudioLesson({
  lesson,
  overlay,
  flush,
  resume,
  onGateChange,
}: LessonMediaProps) {
  const src = getSafeExternalUrl(lesson.sourceUrl);

  return (
    <div>
      {overlay && <MediaBar>{overlay}</MediaBar>}
      {src ? (
        <RealAudioLesson
          lesson={lesson}
          src={src}
          flush={flush}
          resume={resume}
          onGateChange={onGateChange}
        />
      ) : (
        <UnavailableAudioLesson
          lesson={lesson}
          flush={flush}
          onGateChange={onGateChange}
        />
      )}
    </div>
  );
}

function RealAudioLesson({
  lesson,
  src,
  flush,
  resume,
  onGateChange,
}: {
  lesson: ActiveLesson;
  src: string;
  flush?: boolean;
  resume?: LessonResumePoint | null;
  onGateChange?: (gate: LessonGateState) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubRatio, setScrubRatio] = useState<number | null>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [isBroken, setIsBroken] = useState(false);

  const { watchedSeconds, record } = useWatchCoverage(
    lesson.id,
    resume?.watchedSeconds ?? 0,
  );

  const startSeconds = resume?.positionSeconds ?? 0;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(startSeconds);
    setDuration(0);
    setScrubRatio(null);
    setHasEnded(false);
    setIsBroken(false);
  }, [src, startSeconds]);

  /* The element's own duration where it has one; the creator's recorded figure
     covers the moment before the metadata arrives. */
  const durationSeconds =
    duration > 0 ? duration : (lesson.durationSeconds ?? 0);

  const gate = isBroken
    ? unavailableLessonGate()
    : timedLessonGate({
        watchedSeconds,
        durationSeconds,
        positionSeconds: currentTime,
        hasEnded,
        isReady: durationSeconds > 0,
      });

  useReportLessonGate(gate, onGateChange);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  const seek = (ratio: number) => {
    const audio = audioRef.current;
    setScrubRatio(null);
    if (!audio || duration <= 0) return;

    const time = ratio * duration;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const displayedTime =
    scrubRatio !== null && duration > 0 ? scrubRatio * duration : currentTime;
  const progress = duration > 0 ? Math.min(1, displayedTime / duration) : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          setDuration(Number.isFinite(value) ? value : 0);

          /* Put the play head back once the element knows how long it is —
             seeking before that is silently ignored by the browser. Guarded
             against a stale resume point outrunning a re-uploaded file. */
          if (startSeconds > 0 && startSeconds < value) {
            event.currentTarget.currentTime = startSeconds;
            setCurrentTime(startSeconds);
          }
        }}
        onTimeUpdate={(event) => {
          const time = event.currentTarget.currentTime;
          setCurrentTime(time);
          /* Only while playing: a seek also fires this, and landing somewhere
             is not the same as having listened to it. */
          if (!event.currentTarget.paused) record(time);
        }}
        onSeeked={(event) => {
          /* `timeupdate` is silent while paused, so a seek made from anywhere
             other than our own scrub bar — a media key, the OS controls —
             would otherwise leave the play head we save behind where it was.
             Position only: landing somewhere is not listening to it. */
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={(event) => {
          setIsPlaying(false);
          setHasEnded(true);
          /* The final stretch between the last `timeupdate` and the end is
             never reported, so credit it here. */
          record(event.currentTarget.currentTime);
        }}
        onError={() => {
          setIsPlaying(false);
          setIsBroken(true);
          toast.error("This audio lesson could not be played.");
        }}
        className="hidden"
      >
        Your browser cannot play this audio.
      </audio>

      <AudioPlayerShell
        isPlaying={isPlaying}
        onToggle={toggle}
        progress={progress}
        onSeek={seek}
        onScrub={duration > 0 ? setScrubRatio : undefined}
        durationSeconds={duration}
        elapsed={formatClock(displayedTime)}
        duration={duration > 0 ? formatClock(duration) : lesson.duration}
        flush={flush}
      />
    </>
  );
}

/**
 * An audio lesson with no file behind it.
 *
 * The gate opens, so a lesson whose upload has gone missing cannot strand a
 * learner part-way through the course.
 */
function UnavailableAudioLesson({
  lesson,
  flush,
  onGateChange,
}: {
  lesson: ActiveLesson;
  flush?: boolean;
  onGateChange?: (gate: LessonGateState) => void;
}) {
  const gate = unavailableLessonGate();

  useReportLessonGate(gate, onGateChange);

  return (
    <AudioPlayerShell
      isPlaying={false}
      onToggle={() => {}}
      progress={0}
      elapsed="0:00"
      duration={lesson.duration}
      flush={flush}
    />
  );
}
