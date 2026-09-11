import { useCallback, useRef, useState } from "react";

/**
 * Counts the distinct seconds of a lesson's media that were really played.
 *
 * A player reports where it is while it plays, and each whole second it names
 * is kept once, so the figure is coverage rather than position. That is what
 * makes it seek-proof: dragging to the last second credits one second, and
 * playing a passage twice still credits it once. Comparing `currentTime`
 * against the duration instead would treat a drag of the scrub bar as having
 * watched the lesson, which is the thing the gate exists to stop.
 *
 * `resetKey` is the lesson being played. Coverage belongs to one lesson, and
 * the reset happens during render rather than in an effect so that no render
 * ever measures the previous lesson's seconds against the new one — a single
 * stale render there would mark the new lesson finished on arrival.
 *
 * `baselineSeconds` is what earlier sittings already earned, restored from the
 * saved resume point. It is treated as the first `baselineSeconds` of the
 * media, so replaying the opening of a lesson cannot be paid for twice. Which
 * seconds those were is not recorded — only how many — so this mislabels
 * scattered viewing, but it can never credit more than was played.
 */
export function useWatchCoverage(resetKey: string, baselineSeconds = 0) {
  const baseline = Math.max(0, Math.floor(baselineSeconds));

  const seconds = useRef<Set<number>>(new Set());
  const [coverage, setCoverage] = useState({
    key: resetKey,
    baseline,
    watched: baseline,
  });

  if (coverage.key !== resetKey || coverage.baseline !== baseline) {
    seconds.current = new Set();
    setCoverage({ key: resetKey, baseline, watched: baseline });
  }

  /* Read through a ref so `record` keeps one identity for the life of the
     player: it is handed to the YouTube hook, which rebuilds nothing when it
     changes but would re-run its polling effect. */
  const baselineRef = useRef(baseline);
  baselineRef.current = baseline;

  const record = useCallback((time: number) => {
    if (!Number.isFinite(time) || time < 0) return;

    const second = Math.floor(time);

    // Already paid for by an earlier sitting.
    if (second < baselineRef.current) return;
    if (seconds.current.has(second)) return;

    /* Counted here rather than inside the updater: React may call an updater
       twice, and one that mutates would drop the second it had just added. */
    seconds.current.add(second);
    const watched = baselineRef.current + seconds.current.size;

    setCoverage((current) =>
      current.watched === watched ? current : { ...current, watched },
    );
  }, []);

  return {
    /* The baseline on the render that queues a reset, so the caller never sees
       the outgoing lesson's total attributed to the incoming one. */
    watchedSeconds:
      coverage.key === resetKey && coverage.baseline === baseline
        ? coverage.watched
        : baseline,
    record,
  };
}
