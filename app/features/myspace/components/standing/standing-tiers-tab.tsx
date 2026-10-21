import { Check, Lock, Sparkles } from "lucide-react";
import { Progress } from "~/components/ui/progress";
import type { StandingTier } from "~/features/myspace/types";
import { cn } from "~/lib/utils";
import { StandingUnavailable } from "./standing-unavailable";

interface StandingTiersTabProps {
  tiers: {
    currentTierId: string | null;
    totalPoints: number;
    tiers: StandingTier[];
  } | null;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function StandingTiersTab({ tiers }: StandingTiersTabProps) {
  if (!tiers) {
    return <StandingUnavailable label="tiers" />;
  }

  return (
    <section className="rounded-3xl border bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-2 border-b border-slate-100 pb-4 text-base font-semibold tracking-tight text-[#0f172a] dark:border-slate-800 dark:text-slate-100">
        <Sparkles className="size-4.5 text-[#ff9f0a]" />
        Tier journey
      </h2>

      <ol className="relative mt-6">
        {tiers.tiers.map((tier, index) => {
          const nextTier = tiers.tiers[index + 1];
          const isCurrent = tier.id === tiers.currentTierId;
          const isReached = tiers.totalPoints >= tier.minPoints;
          const isLast = index === tiers.tiers.length - 1;
          const progressToNext = nextTier
            ? Math.min(
                ((tiers.totalPoints - tier.minPoints) /
                  Math.max(nextTier.minPoints - tier.minPoints, 1)) *
                  100,
                100,
              )
            : 100;

          return (
            <li key={tier.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={cn(
                    "absolute top-10 bottom-0 left-5 w-0.5 -translate-x-1/2",
                    tiers.totalPoints >= (nextTier?.minPoints ?? Infinity)
                      ? "bg-[#ff9f0a]"
                      : "bg-[#e2e8f0]",
                  )}
                />
              )}

              <span
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                  isCurrent
                    ? "bg-[#ff9f0a] text-white ring-4 ring-[#ffedd5]"
                    : isReached
                      ? "bg-[#fff7ed] text-[#ea580c]"
                      : "bg-[#f1f5f9] text-[#94a3b8]",
                )}
              >
                {isCurrent ? (
                  <Sparkles className="size-5" />
                ) : isReached ? (
                  <Check className="size-5" />
                ) : (
                  <Lock className="size-4" />
                )}
              </span>

              <div
                className={cn(
                  "min-w-0 flex-1 rounded-2xl border p-4",
                  isCurrent
                    ? "border-[#fdba74] bg-[#fff7ed] dark:border-amber-700 dark:bg-amber-950/30"
                    : "border-transparent bg-[#f8fafc] dark:bg-slate-800/60",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-bold tracking-wide uppercase",
                        isReached
                          ? "text-[#0f172a] dark:text-slate-100"
                          : "text-[#64748b] dark:text-slate-400",
                      )}
                    >
                      {tier.name}
                    </span>
                    {isCurrent && (
                      <span className="rounded-full bg-[#ff9f0a] px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#2563eb]">
                    {tier.minPoints.toLocaleString()}+ pts
                  </span>
                </div>

                {tier.description && (
                  <p className="mt-1.5 text-sm text-[#64748b] dark:text-slate-400">
                    {tier.description}
                  </p>
                )}

                {isCurrent && nextTier && (
                  <div className="mt-3 space-y-1.5">
                    <Progress
                      value={progressToNext}
                      className="h-2 bg-white **:data-[slot=progress-indicator]:bg-[#ff9f0a]"
                    />
                    <p className="text-xs font-semibold text-[#ea580c]">
                      {(
                        nextTier.minPoints - tiers.totalPoints
                      ).toLocaleString()}{" "}
                      points until {nextTier.name}
                    </p>
                  </div>
                )}

                <p className="mt-2 text-xs font-semibold text-[#94a3b8]">
                  {tier.achievedAt
                    ? `Reached on ${dateFormatter.format(new Date(tier.achievedAt))}`
                    : isReached
                      ? "Reached"
                      : `${(tier.minPoints - tiers.totalPoints).toLocaleString()} pts to go`}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
