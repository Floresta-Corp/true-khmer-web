import type { ReactNode } from "react";
import { Sparkles, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import type { NextTier, Tier } from "~/features/myspace/types";
import { Button } from "~/components/ui/button";

interface CommunityStandingCardProps {
  totalPoints: number;
  tier: Tier;
  rank: string | null;
  nextTier: NextTier | null;
  pointsUntilNextTier: number;
}

export function CommunityStandingCard({
  totalPoints,
  tier,
  rank,
  nextTier,
  pointsUntilNextTier,
}: CommunityStandingCardProps) {
  const targetPoints = nextTier?.minPoints ?? totalPoints;
  const tierPointRange = nextTier
    ? Math.max(nextTier.minPoints - tier.minPoints, 1)
    : 1;
  const pointsEarnedInTier = Math.max(totalPoints - tier.minPoints, 0);
  const progressPercentage = nextTier
    ? Math.min((pointsEarnedInTier / tierPointRange) * 100, 100)
    : 100;
  const progressLabel = nextTier
    ? `${totalPoints} / ${targetPoints} pts`
    : `${totalPoints} pts`;
  const nextTierMessage = nextTier
    ? `${pointsUntilNextTier} points until you unlock ${nextTier.name} Tier!`
    : "You have reached the highest tier.";

  return (
    <Card className="w-full rounded-3xl border bg-white p-6 shadow-none">
      <CardHeader className="p-0 pb-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight text-[#0f172a]">
            <Trophy className="size-4.5 text-[#ff9f0a]" />
            Community Standing
          </CardTitle>
          {/* <Button
            variant="ghost"
            className="shrink-0 text-xs font-bold text-[#064cff] transition-colors hover:text-[#0037bd]"
          >
            Tiers & Benefits
          </Button> */}
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-2 text-center @sm:gap-4">
          <StandingStat
            label="Points"
            value={totalPoints}
            valueClassName="text-[#2563eb]"
          />
          <div className="h-8 w-px bg-[#e2e8f0]" />
          <StandingStat label="Rank" value={rank ? `#${rank}` : "-"} />
          <div className="h-8 w-px bg-[#e2e8f0]" />
          <StandingStat
            label="Tier"
            value={tier.name.toUpperCase()}
            valueClassName="text-[#ea580c] text-[14px]"
          >
            <Sparkles className="size-3 text-[#ff9f0a]" />
          </StandingStat>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:justify-between">
            <span className="text-xs font-semibold text-[#64748b]">
              Next Tier Progress
            </span>
            <span className="text-xs font-bold text-blue-500">
              {progressLabel}
            </span>
          </div>

          <Progress
            value={progressPercentage}
            className="h-2 bg-[#e8f0ff] [&_[data-slot=progress-indicator]]:bg-blue-500"
          />

          <p className="text-xs font-semibold text-[#8a99b5]">
            {nextTierMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function StandingStat({
  label,
  value,
  valueClassName = "text-[#0f172a]",
  children,
}: {
  label: string;
  value: string | number;
  valueClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#94a3b8] uppercase">
        {label}
        {children}
      </span>
      <span className={`text-lg leading-6 font-semibold ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}
