import { LESSON_COMPLETION_RATIO } from "~/features/education/types";

export const PDF_SECONDS_PER_PAGE = 15;

export const PDF_MIN_SECONDS = 30;

export const PDF_MAX_SECONDS = 600;

export const PDF_SECONDS_WITHOUT_PAGE_COUNT = 60;

export function pdfReadingSeconds(
  pageCount: number | null | undefined,
): number {
  if (!pageCount || !Number.isFinite(pageCount) || pageCount < 1) {
    return PDF_SECONDS_WITHOUT_PAGE_COUNT;
  }

  return Math.min(
    PDF_MAX_SECONDS,
    Math.max(PDF_MIN_SECONDS, Math.round(pageCount * PDF_SECONDS_PER_PAGE)),
  );
}

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

export function readingLessonGate({
  elapsedSeconds,
  requiredSeconds,
}: {
  elapsedSeconds: number;
  requiredSeconds: number;
}) {
  const isSatisfied = elapsedSeconds >= requiredSeconds;

  return {
    ratio: isSatisfied ? 1 : clampRatio(elapsedSeconds / requiredSeconds),
    isSatisfied,
    watchedSeconds: elapsedSeconds,
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
