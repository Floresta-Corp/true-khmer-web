import React from "react";
import { useRevalidator } from "react-router";

/**
 * Re-runs the route loader when the viewer comes back to the tab, so changes
 * the profile owner made in the meantime (e.g. visibility settings) show up
 * without a manual reload. Throttled to one refetch per `minIntervalMs`.
 */
export function useRefetchOnFocus(minIntervalMs = 5_000) {
  const revalidator = useRevalidator();
  const lastRunRef = React.useRef(0);
  const revalidatorRef = React.useRef(revalidator);
  revalidatorRef.current = revalidator;

  React.useEffect(() => {
    const refetch = () => {
      if (document.visibilityState !== "visible") return;
      const current = revalidatorRef.current;
      if (current.state !== "idle") return;
      const now = Date.now();
      if (now - lastRunRef.current < minIntervalMs) return;
      lastRunRef.current = now;
      void current.revalidate();
    };

    document.addEventListener("visibilitychange", refetch);
    window.addEventListener("focus", refetch);
    return () => {
      document.removeEventListener("visibilitychange", refetch);
      window.removeEventListener("focus", refetch);
    };
  }, [minIntervalMs]);
}
