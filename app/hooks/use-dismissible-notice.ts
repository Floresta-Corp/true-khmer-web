import { useCallback, useEffect, useState } from "react";

const STORAGE_PREFIX = "tk:notice-dismissed:";

/**
 * One-shot notice that stays dismissed across visits.
 *
 * Pass `null` while there is nothing to show. The key should identify the
 * *occurrence*, not just the subject — e.g. `${postId}:${suspendedAt}` — so a
 * post suspended, restored, then suspended again notifies its author afresh
 * instead of staying silent on the strength of an old dismissal.
 *
 * `localStorage` is read in an effect rather than during render: it does not
 * exist on the server, and seeding state from it would desync hydration. The
 * notice therefore starts closed and opens on the first client pass.
 */
export function useDismissibleNotice(key: string | null) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!key) {
      setIsOpen(false);
      return;
    }

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(`${STORAGE_PREFIX}${key}`) !== null;
    } catch {
      // Private browsing or a blocked storage partition — show the notice
      // rather than swallowing it; the worst case is it reappears next visit.
    }

    setIsOpen(!dismissed);
  }, [key]);

  const dismiss = useCallback(() => {
    setIsOpen(false);
    if (!key) return;

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, "1");
    } catch {
      // Non-fatal: the notice simply isn't remembered.
    }
  }, [key]);

  /** Reopens without clearing the stored dismissal (e.g. a "See reason" button). */
  const reopen = useCallback(() => setIsOpen(true), []);

  return { isOpen, dismiss, reopen };
}
