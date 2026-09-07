import { useEffect, useRef, useState } from "react";
import { getSafeExternalUrl } from "~/lib/utils";
import type { ActiveLesson } from "~/features/education/types";
import { formatClock } from "~/features/education/lib/lesson-media";
import { AudioPlayerShell } from "./audio-player-shell";
import { MediaBar, type LessonMediaProps } from "./lesson-media-frame";

export function AudioLesson({ lesson, overlay, flush }: LessonMediaProps) {
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
  const [scrubRatio, setScrubRatio] = useState<number | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setScrubRatio(null);
  }, [src]);

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
        onScrub={duration > 0 ? setScrubRatio : undefined}
        durationSeconds={duration}
        elapsed={formatClock(displayedTime)}
        duration={duration > 0 ? formatClock(duration) : lesson.duration}
        flush={flush}
      />
    </>
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
