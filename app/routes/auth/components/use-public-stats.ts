import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import type {
  PublicStats,
  PublicStatsResult,
} from "~/routes/auth/domain/public-stats.types";

export function usePublicStats(): PublicStats | null {
  const fetcher = useFetcher<PublicStatsResult>();
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    fetcher.load("/api/public/stats");
  }, [fetcher]);

  return fetcher.data?.ok ? fetcher.data.stats : null;
}

export function toSparklinePath(
  series: number[],
  width: number,
  height: number,
  padding = 5,
) {
  if (series.length < 2) return null;

  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = max - min;
  const stepX = (width - padding * 2) / (series.length - 1);
  const usableHeight = height - padding * 2;

  return series
    .map((value, index) => {
      const x = padding + index * stepX;
      const ratio = span === 0 ? 0.5 : (value - min) / span;
      const y = padding + (1 - ratio) * usableHeight;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join("");
}
