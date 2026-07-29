import { useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { StatItem } from "../types";

// Cards should animate in once per session. Any incidental re-render or
// remount afterwards (e.g. from a notification context update) must not
// replay the entrance animation. Tracked module-side so it survives remounts.
const animatedCardIds = new Set<string>();

interface KpiCardProps {
  item: StatItem;
  index: number;
}

function DeltaBadge({
  delta,
  tone,
}: {
  delta: string;
  tone: StatItem["deltaTone"];
}) {
  if (tone === "neutral" || !tone) {
    return (
      <span className="inline-flex items-center rounded-full bg-(--admin-card-muted) px-2 py-0.5 text-[11px] font-semibold text-(--admin-text-secondary)">
        {delta}
      </span>
    );
  }
  const isUp = tone === "up";
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        isUp
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400"
      }`}
    >
      {isUp ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {delta}
    </span>
  );
}

export function KpiCard({ item, index }: KpiCardProps) {
  const hasAnimated = animatedCardIds.has(item.id);
  useEffect(() => {
    animatedCardIds.add(item.id);
  }, [item.id]);

  const entranceInitial = hasAnimated ? false : { opacity: 0, y: 20 };
  const entranceTransition = hasAnimated
    ? { duration: 0 }
    : { duration: 0.4, delay: index * 0.1 };

  return (
    <motion.div
      initial={entranceInitial}
      animate={{ opacity: 1, y: 0 }}
      transition={entranceTransition}
      className="rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-(--admin-text-secondary)">
          {item.label}
        </p>
        {item.delta && <DeltaBadge delta={item.delta} tone={item.deltaTone} />}
      </div>
      <p className="mt-2.5 text-[30px] leading-none font-bold tracking-tight text-(--admin-text)">
        {item.value}
      </p>
    </motion.div>
  );
}
