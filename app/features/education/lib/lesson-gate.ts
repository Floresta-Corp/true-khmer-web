import { LESSON_COMPLETION_RATIO } from "~/features/education/types";

/**
 * What each kind of lesson has to do before the next one opens.
 *
 * Every gate here asks for something the learner did to the media, never for
 * time they spent near it. Video and audio count the seconds really played,
 * and 95% of the media is the bar. A document asks to be scrolled through to
 * its last page. A clock would be easier to measure and would mean nothing: it
 * says a file was open, not that anyone read it.
 */

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
 * The gate for a document lesson.
 *
 * The one piece of evidence taken is the learner having scrolled our own
 * viewer to the last page — a thing they did to the document, which is what a
 * gate is for. Only a viewer we draw ourselves can see it: a PDF handed to the
 * browser's built-in viewer is a closed frame that reports nothing, and those
 * lessons are opened by `unavailableLessonGate` rather than held shut on
 * evidence that is never coming.
 *
 * `ratio` is either end of the scale because there is no half-read: a document
 * has been through to its end or it has not.
 *
 * `watchedSeconds` is null because nothing is counted. The completion check
 * compares it against the lesson's duration, so reporting zero against a
 * document would read as "not played through" and refuse the very completion
 * this is opening; null makes that check skip, as it does for a lesson with
 * nothing behind it.
 */
export function documentLessonGate(hasReachedEnd: boolean) {
  return {
    ratio: hasReachedEnd ? 1 : 0,
    isSatisfied: hasReachedEnd,
    watchedSeconds: null,
    /* A document has no play head, and its place in the reading is not worth
       restoring: what persists across visits is the finished lesson itself. */
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
