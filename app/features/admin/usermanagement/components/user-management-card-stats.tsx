import { motion } from "motion/react";

import { Skeleton } from "~/components/ui/skeleton";
import type { AdminUserManagementStats } from "~/types/api-client";

type BadgeTone = "up" | "down" | "info" | "neutral";

type StatCard = {
  id: string;
  label: string;
  value: number | string;
  /** Pill shown at the top-right — a delta or a share of the total. */
  badge?: string;
  badgeTone?: BadgeTone;
};

const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  up: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  down: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

/** A usable percentage, or null when the API has no comparison to report. */
function toPercent(value: number | null): number | null {
  return value !== null && Number.isFinite(value) ? value : null;
}

function toneOf(value: number): BadgeTone {
  if (value === 0) return "neutral";
  return value > 0 ? "up" : "down";
}

/** Deltas read better with an explicit sign; shares do not. */
function formatDelta(value: number): string {
  return `${value > 0 ? "+" : ""}${value}%`;
}

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function UserManagementStatsCards({
  stats,
}: {
  stats: AdminUserManagementStats;
}) {
  const totalGrowth = toPercent(stats.totalUsers.growthPercent);
  const activeShare = toPercent(stats.activeUsers.percentOfTotal);
  const newChange = toPercent(stats.newThisMonth.changePercent);

  const cards: StatCard[] = [
    {
      id: "total",
      label: "Total Users",
      value: formatCount(stats.totalUsers.count),
      ...(totalGrowth !== null
        ? {
            badge: formatDelta(totalGrowth),
            badgeTone: toneOf(totalGrowth),
          }
        : {}),
    },
    {
      id: "active",
      label: "Active Users",
      value: formatCount(stats.activeUsers.count),
      ...(activeShare !== null
        ? { badge: `${activeShare}%`, badgeTone: "up" as const }
        : {}),
    },
    {
      id: "new",
      label: "New This Month",
      value: formatCount(stats.newThisMonth.count),
      ...(newChange !== null
        ? { badge: formatDelta(newChange), badgeTone: "info" as const }
        : {}),
    },
    {
      id: "top-tier",
      label: "Top Tier",
      value: stats.topTier?.name ?? "—",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.06 }}
          className="rounded-2xl border border-(--admin-border) bg-white p-5 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-semibold tracking-wider text-(--admin-text-secondary) uppercase">
              {card.label}
            </p>
            {card.badge !== undefined ? (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  BADGE_TONE_CLASS[card.badgeTone ?? "neutral"]
                }`}
              >
                {card.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-2 truncate text-3xl font-bold tracking-tight text-(--admin-text)">
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export function UserManagementStatsCardsSkeleton() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-(--admin-border) bg-white p-5 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="mt-2.5 h-8 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}
