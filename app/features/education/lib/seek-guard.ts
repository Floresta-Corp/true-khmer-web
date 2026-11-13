/**
 * Tells playback apart from a seek for players that report both through the
 * same time update.
 *
 * A seek made while the media is playing still produces a time update for the
 * spot it lands on, and the player is not paused then, so a "credit only while
 * playing" check would count that second as watched. Repeated scrubs would add
 * up to the completion bar without anything being watched.
 *
 * The guard ignores updates between `seeking` and `seeked`, and after the seek
 * it ignores the landing spot itself until playback moves past it. Players do
 * not agree on whether the landing update comes before or after `seeked`, and
 * this covers both orders.
 */
export function createSeekGuard() {
  let isSeeking = false;
  let landedAt: number | null = null;

  return {
    seeking() {
      isSeeking = true;
    },
    seeked(time: number) {
      isSeeking = false;
      landedAt = time;
    },
    /** Whether a time update at `time` is playback that can be credited. */
    credits(time: number) {
      if (isSeeking) return false;
      if (landedAt !== null) {
        if (time <= landedAt) return false;
        landedAt = null;
      }
      return true;
    },
  };
}
