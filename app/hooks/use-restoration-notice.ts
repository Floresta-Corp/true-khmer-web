import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "tk:was-suspended:";

/**
 * Announces that a post the viewer previously saw suspended is public again.
 *
 * Unlike a suspension, a restoration leaves no trace on the post: `status` goes
 * back to its pre-hold value and `suspendedAt`/`suspensionReason` are cleared,
 * so a restored post is indistinguishable from one that was never held. The
 * only way to spot the transition without a backend signal is to remember the
 * suspension locally and notice it is gone.
 *
 * A marker is written whenever the author views the post while it is suspended;
 * seeing that marker on a post that is no longer suspended is the restoration.
 *
 * Consequence worth knowing: if the author never opened the post while it was
 * held (or did so in another browser), there is no marker and no notice. The
 * expected path — suspension notification, then restoration notification —
 * writes the marker on the first visit, so it holds for that flow.
 */
export function useRestorationNotice(
  postId: string | null,
  isSuspended: boolean,
) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!postId) {
      setIsOpen(false);
      return;
    }

    const storageKey = `${STORAGE_PREFIX}${postId}`;

    // Still on hold: record it, and make sure the "restored" notice is closed.
    if (isSuspended) {
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        // Storage unavailable — the restoration simply goes unannounced.
      }
      setIsOpen(false);
      return;
    }

    let wasSuspended = false;
    try {
      wasSuspended = localStorage.getItem(storageKey) !== null;
    } catch {
      // Treated as "never suspended": better to stay quiet than to congratulate
      // someone on a restoration that never happened.
    }

    setIsOpen(wasSuspended);
  }, [postId, isSuspended]);

  // The marker is cleared on dismissal rather than on read, so an accidental
  // reload before acknowledging does not swallow the good news.
  const dismiss = useCallback(() => {
    setIsOpen(false);
    if (!postId) return;

    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${postId}`);
    } catch {
      // Non-fatal: the notice reappears next visit.
    }
  }, [postId]);

  return { isOpen, dismiss };
}
