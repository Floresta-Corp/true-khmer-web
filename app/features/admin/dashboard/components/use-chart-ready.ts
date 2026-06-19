import { useEffect, useState } from "react";

/**
 * Recharts' ResponsiveContainer measures its parent via ResizeObserver, which
 * has no dimensions during SSR / the first hydration paint — that produces the
 * `width(-1) height(-1)` console warnings. Gating the chart on a mount effect
 * keeps the server and first client render identical (no hydration mismatch)
 * and only mounts the chart once a real layout box exists.
 */
export function useChartReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}
