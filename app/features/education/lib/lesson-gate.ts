import {
  LESSON_COMPLETION_RATIO,
  type LessonGateState,
} from "~/features/education/types";

export function requiredWatchSeconds(durationSeconds: number): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return 0;
  return durationSeconds * LESSON_COMPLETION_RATIO;
}

const clampRatio = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

export function timedLessonGate({
  watchedSeconds,
  durationSeconds,
  recordedDurationSeconds,
  positionSeconds,
  hasEnded,
}: {
  watchedSeconds: number;
  durationSeconds: number;
  recordedDurationSeconds: number | null | undefined;
  positionSeconds: number;
  hasEnded: boolean;
  isReady?: boolean;
}): LessonGateState {
  const recorded =
    recordedDurationSeconds && recordedDurationSeconds > 0
      ? recordedDurationSeconds
      : null;
  const required = requiredWatchSeconds(recorded ?? durationSeconds);

  const isSatisfied =
    (required > 0 && watchedSeconds >= required) ||
    (required === 0 && hasEnded && watchedSeconds > 0);

  const ratio = isSatisfied
    ? 1
    : required > 0
      ? clampRatio(watchedSeconds / required)
      : 0;

  const secondsShort =
    hasEnded && !isSatisfied && required > 0
      ? Math.ceil(required - watchedSeconds)
      : undefined;

  return { ratio, isSatisfied, watchedSeconds, positionSeconds, secondsShort };
}

export function documentLessonGate(hasReachedEnd: boolean) {
  return {
    ratio: hasReachedEnd ? 1 : 0,
    isSatisfied: hasReachedEnd,
    watchedSeconds: null,
    positionSeconds: 0,
  };
}

export function unavailableLessonGate() {
  return {
    ratio: 1,
    isSatisfied: true,
    watchedSeconds: null,
    positionSeconds: 0,
  };
}
