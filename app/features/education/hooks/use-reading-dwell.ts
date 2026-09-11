import { useEffect, useRef, useState } from "react";

/**
 * Seconds spent with a document lesson actually on screen.
 *
 * A PDF is a file in a frame from another origin, so nothing in the page can
 * see a scroll or a page turn — time with the document open is the only thing
 * left to measure. It is a weak proxy for reading, which is why it gates a
 * confirmation rather than standing in for one.
 *
 * The count pauses when the tab is hidden, so leaving the lesson parked in a
 * background tab does not get through it. `baselineSeconds` carries in the
 * time a previous visit already served, so coming back to a long document does
 * not restart the wait.
 */
export function useReadingDwell(resetKey: string, baselineSeconds = 0) {
  const baseline = Math.max(0, Math.floor(baselineSeconds));
  const [dwell, setDwell] = useState({
    key: resetKey,
    baseline,
    seconds: baseline,
  });

  /* Reset during render, not in an effect: one render carrying the previous
     document's total would let the next lesson open on arrival. */
  if (dwell.key !== resetKey || dwell.baseline !== baseline) {
    setDwell({ key: resetKey, baseline, seconds: baseline });
  }

  const keyRef = useRef(resetKey);
  keyRef.current = resetKey;

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;

      setDwell((current) =>
        current.key === keyRef.current
          ? { ...current, seconds: current.seconds + 1 }
          : current,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resetKey]);

  return dwell.key === resetKey && dwell.baseline === baseline
    ? dwell.seconds
    : baseline;
}
