import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { openPlumpiHandoffWindow } from "~/lib/plumpi/handoff.client";

/**
 * What an action serving a Plumpi handoff answers with. Feature action types
 * are wider than this — they carry their own fields — but only these are read
 * here, so they stay structurally compatible.
 */
export type PlumpiHandoffResult = {
  ok: boolean;
  redirectTo?: string;
  error?: string;
};

type StartOptions = {
  /** Route the submission is posted to. Defaults to the current route. */
  action?: string;
  /**
   * Identifies the row that started the handoff, so a listing can show the
   * spinner on the card that was clicked rather than on all of them.
   */
  key?: string;
};

/**
 * Drives the whole "continue in Plumpi" crossing from a component.
 *
 * The handoff URL can only be minted server-side, but a tab opened after the
 * round trip is blocked as an unrequested pop-up — so `start` opens the tab
 * synchronously on click, submits, and this hook points that tab at the URL
 * once the action answers. It owns the tab reference, the once-per-response
 * guard, the pending flag and every failure toast; callers only supply the
 * form fields and render the overlay while `isRedirecting`.
 *
 * The fetcher is private to the hook, so a page whose own fetcher does other
 * work (creating a draft, say) keeps the two flows apart.
 */
export function usePlumpiHandoff({
  popupBlockedMessage = "Allow pop-ups to continue in Plumpi.",
  failureMessage = "Plumpi could not be opened automatically.",
}: {
  /** Shown when the browser refused the tab — nothing else can be done. */
  popupBlockedMessage?: string;
  /** Fallback when the action reports a failure without a message. */
  failureMessage?: string;
} = {}) {
  const fetcher = useFetcher<PlumpiHandoffResult>();
  /** Opened synchronously on click so the browser allows the redirect. */
  const plumpiWindowRef = useRef<Window | null>(null);
  const handledResultRef = useRef<PlumpiHandoffResult | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // A tab left spinning after the page goes away can never be redirected.
  useEffect(() => {
    return () => plumpiWindowRef.current?.close();
  }, []);

  useEffect(() => {
    const result = fetcher.data;
    if (
      !result ||
      fetcher.state !== "idle" ||
      handledResultRef.current === result
    ) {
      return;
    }
    handledResultRef.current = result;

    const plumpiWindow = plumpiWindowRef.current;
    plumpiWindowRef.current = null;
    setIsRedirecting(false);
    setPendingKey(null);

    if (!result.ok || !result.redirectTo) {
      plumpiWindow?.close();
      toast.error(result.error ?? failureMessage);
      return;
    }

    if (!plumpiWindow || plumpiWindow.closed) {
      toast.error("The Plumpi tab was closed. Please try again.");
      return;
    }

    plumpiWindow.location.replace(result.redirectTo);
  }, [failureMessage, fetcher.data, fetcher.state]);

  /**
   * Opens the Plumpi tab and posts `fields` to the handoff action. Returns
   * `false` when the pop-up was blocked, so a caller that has more to undo can
   * react; the toast is already raised either way.
   */
  const start = useCallback(
    (fields: Record<string, string>, options: StartOptions = {}) => {
      if (isRedirecting) return false;

      const plumpiWindow = openPlumpiHandoffWindow();
      if (!plumpiWindow) {
        toast.error(popupBlockedMessage);
        return false;
      }
      plumpiWindowRef.current = plumpiWindow;

      setIsRedirecting(true);
      setPendingKey(options.key ?? null);
      fetcher.submit(fields, { method: "post", action: options.action });
      return true;
    },
    [fetcher, isRedirecting, popupBlockedMessage],
  );

  return { start, isRedirecting, pendingKey };
}
