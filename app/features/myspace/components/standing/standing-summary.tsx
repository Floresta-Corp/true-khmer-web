import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import type { StandingTier } from "~/features/myspace/types";

interface StandingSummaryProps {
  totalPoints: number;
  rank: number | null;
  tiers: StandingTier[];
  currentTierId: string | null;
}

export function StandingSummary({
  totalPoints,
  rank,
  tiers,
  currentTierId,
}: StandingSummaryProps) {
  const currentTier = tiers.find((tier) => tier.id === currentTierId) ?? null;
  const nextTier = tiers.find((tier) => tier.minPoints > totalPoints) ?? null;
  const floor = currentTier?.minPoints ?? 0;
  const progress = nextTier
    ? Math.min(
        ((totalPoints - floor) / Math.max(nextTier.minPoints - floor, 1)) * 100,
        100,
      )
    : 100;

  return (
    <section
      aria-label="Your community standing"
      className="grid gap-6 rounded-3xl border bg-white p-5 sm:p-6 xl:grid-cols-[1.2fr_1fr] xl:gap-8 dark:bg-slate-900"
    >
      <div className="grid grid-cols-3 items-center divide-x divide-[#e2e8f0] dark:divide-slate-700">
        <SummaryStat label="Points" valueClassName="text-[#2563eb]">
          {totalPoints.toLocaleString()}
        </SummaryStat>
        <SummaryStat
          label="Rank"
          valueClassName="text-[#0f172a] dark:text-white"
        >
          {rank ? `#${rank}` : "—"}
        </SummaryStat>
        <SummaryStat label="Tier" valueClassName="text-[#ea580c]">
          <span className="inline-flex items-center justify-center gap-1.5">
            <Sparkles className="size-4 shrink-0 text-[#ff9f0a]" />
            {currentTier?.name ?? "—"}
          </span>
        </SummaryStat>
      </div>
      <div className="space-y-3 border-t pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <span className="text-[#64748b] dark:text-slate-400">
            {nextTier ? "Next Tier Progress" : "Highest tier reached"}
          </span>
          <span className="font-bold text-blue-500">
            {totalPoints.toLocaleString()}
            {nextTier ? ` / ${nextTier.minPoints.toLocaleString()}` : ""} pts
          </span>
        </div>
        <Progress
          animate
          value={Math.max(0, progress)}
          aria-label="Progress to next tier"
          className="h-2 bg-[#e8f0ff] [&_[data-slot=progress-indicator]]:bg-blue-500"
        />
        <p className="text-xs font-semibold text-[#8a99b5]">
          {nextTier
            ? `${(nextTier.minPoints - totalPoints).toLocaleString()} points until you unlock ${nextTier.name} Tier!`
            : "You have reached the highest tier."}
        </p>
      </div>
    </section>
  );
}

function SummaryStat({
  label,
  children,
  valueClassName,
}: {
  label: string;
  children: ReactNode;
  valueClassName: string;
}) {
  return (
    <div className="min-w-0 px-2 text-center">
      <p className="text-[10px] font-bold tracking-wider text-[#94a3b8] uppercase">
        {label}
      </p>
      <div
        className={`mt-2 text-xl font-semibold break-words sm:text-2xl ${valueClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
