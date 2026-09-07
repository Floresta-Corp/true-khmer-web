import { useEffect, useMemo, useState } from "react";
import type { RefObject } from "react";

const WAVEFORM_BAR_PITCH = 18;
const MIN_WAVEFORM_BARS = 24;
const MAX_WAVEFORM_BARS = 160;

function barNoise(index: number): number {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function useWaveformBars(ref: RefObject<HTMLElement | null>) {
  const [count, setCount] = useState(48);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (width <= 0) return;

      setCount(
        Math.min(
          MAX_WAVEFORM_BARS,
          Math.max(MIN_WAVEFORM_BARS, Math.round(width / WAVEFORM_BAR_PITCH)),
        ),
      );
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        heightPercent: 18 + barNoise(index) * 82,
      })),
    [count],
  );
}
