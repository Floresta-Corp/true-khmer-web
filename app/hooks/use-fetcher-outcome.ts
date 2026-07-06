import { useEffect, useRef } from "react";
import { readActionResult } from "~/lib/action-result";

interface UseFetcherOutcomeOptions {
  /** Called once after a submission resolves successfully. */
  onSuccess?: (message?: string) => void;
  /** Called once after a submission resolves with a failure. */
  onError?: (message?: string) => void;
}

/**
 * Watches a fetcher for a completed submission and fires `onSuccess`/`onError`
 * exactly once per submission, normalizing the response via `readActionResult`.
 *
 * Replaces the hand-rolled `wasSubmitting` ref + effect that was duplicated (with
 * inconsistent success detection) across many forum components.
 */
export function useFetcherOutcome(
  fetcher: { state: "idle" | "loading" | "submitting"; data: unknown },
  { onSuccess, onError }: UseFetcherOutcomeOptions,
) {
  const wasSubmitting = useRef(false);
  // Keep the latest callbacks without re-running the effect on every render.
  const handlersRef = useRef({ onSuccess, onError });
  handlersRef.current = { onSuccess, onError };

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetcher.state === "idle" && fetcher.data) {
      wasSubmitting.current = false;
      const { ok, message } = readActionResult(fetcher.data);
      if (ok) {
        handlersRef.current.onSuccess?.(message);
      } else {
        handlersRef.current.onError?.(message);
      }
    }
  }, [fetcher.state, fetcher.data]);
}
