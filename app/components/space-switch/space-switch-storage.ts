const STORAGE_PREFIX = "tk:space-intro-seen:";

/**
 * Tracks whether the one-time intro for a space has already been shown.
 *
 * Read lazily on click rather than during render or in an effect: the intro is
 * only ever needed in response to a user gesture, so `localStorage` never has to
 * seed React state and there is nothing to desync at hydration.
 */
export function hasSeenSpaceIntro(spaceId: string) {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${spaceId}`) !== null;
  } catch {
    // Private browsing or a blocked storage partition. Treat it as seen so the
    // switch stays a plain navigation instead of a dialog on every click.
    return true;
  }
}

export function markSpaceIntroSeen(spaceId: string) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${spaceId}`, "1");
  } catch {
    // Non-fatal: the intro simply isn't remembered.
  }
}
