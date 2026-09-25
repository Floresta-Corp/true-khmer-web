import { LESSON_COMPLETION_RATIO } from "~/features/education/types";

export function requiredWatchSeconds(durationSeconds: number): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return 0;
  return durationSeconds * LESSON_COMPLETION_RATIO;
}

const clampRatio = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

export function timedLessonGate({
  watchedSeconds,
  durationSeconds,
  positionSeconds,
  hasEnded,
  isReady,
}: {
  watchedSeconds: number;
  durationSeconds: number;
  positionSeconds: number;
  hasEnded: boolean;
  isReady: boolean;
}) {
  const required = requiredWatchSeconds(durationSeconds);

  const isSatisfied =
    (hasEnded && watchedSeconds > 0) ||
    (required > 0 && watchedSeconds >= required);

  const ratio = isSatisfied
    ? 1
    : required > 0
      ? clampRatio(watchedSeconds / required)
      : 0;

  return { ratio, isSatisfied, watchedSeconds, positionSeconds };
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
