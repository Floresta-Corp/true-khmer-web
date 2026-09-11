import { LESSON_COMPLETION_RATIO } from "~/features/education/types";

/**
 * What each kind of lesson has to do before the next one opens.
 *
 * Video and audio are measurable: the player counts the seconds it really
 * played, and 95% of the media is the bar. A PDF is not — it is a file in a
 * frame served from another origin, so nothing in the page can see a page turn
 * or a scroll. The honest substitute is time spent with the document open,
 * after which the learner says they have read it. The timer is not proof of
 * reading; it is what stops "read" being a click on arrival.
 */

/** Reading time asked of one page, before the floor and ceiling below. */
export const PDF_SECONDS_PER_PAGE = 15;

/** Enough that a one-page handout is not finished by accident. */
export const PDF_MIN_SECONDS = 30;

/** A long document should not hold the course up for half an hour. */
export const PDF_MAX_SECONDS = 600;

/** Used when the creator never recorded a page count. */
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

/** Seconds of a timed lesson that count as having watched it. */
export function requiredWatchSeconds(durationSeconds: number): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return 0;
  return durationSeconds * LESSON_COMPLETION_RATIO;
}

const clampRatio = (value: number) =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

/**
 * The gate for a video or audio lesson.
 *
 * `watchedSeconds` counts the distinct seconds of the media that were played,
 * so skipping to the end leaves it near zero — the lesson opens the next one
 * only if it was actually played through. `hasEnded` is taken on trust because
 * a player only reaches its end by playing there.
 */
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

  /* `hasEnded` is only believed alongside evidence of play. A player that
     says it ended but has covered nothing is not a learner who finished a
     lesson — it is the previous lesson's state being read against this one,
     which would mark the new lesson finished the moment it opened and unlock
     the one after it. Players are rebuilt per lesson so this should not
     arise; it is cheap to refuse it outright rather than rely on that.

     Before the media reports a duration there is nothing to measure against,
     so the gate is shut rather than open — an unknown duration must not read
     as "nothing left to watch". */
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

/**
 * The gate for a PDF lesson.
 *
 * Time served is all there is to go on, so it is what finishes the lesson.
 * That is a weaker claim than a video played through — it says the document
 * was open, not that it was read — but it is the only thing measurable across
 * an iframe from another origin, and it still cannot be satisfied on arrival.
 */
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
    /* Reading time served. The completion check compares this against the
       lesson's duration, and a document has none, so it is ignored there —
       but it is what the resume point restores, so the timer picks up where
       it stopped instead of starting the wait again. */
    watchedSeconds: elapsedSeconds,
    /* A document has no play head; its place is the time already served. */
    positionSeconds: 0,
  };
}

/**
 * A lesson with nothing playable behind it.
 *
 * A creator can leave a lesson pointing at an address that is not a video, or
 * at a file that has gone. Holding the gate shut there would strand the
 * learner — and the course's certificate — on a lesson that can never be
 * finished, so it opens instead. The player says why in its own right.
 *
 * `watchedSeconds` stays null so the completion check is skipped: reporting
 * zero against a lesson that does have a recorded duration would be read as
 * "not played to the end" and refuse the very completion this is opening.
 */
export function unavailableLessonGate() {
  return {
    ratio: 1,
    isSatisfied: true,
    watchedSeconds: null,
    positionSeconds: 0,
  };
}
