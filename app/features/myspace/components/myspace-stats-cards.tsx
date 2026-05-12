import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Star, Award, Trophy } from "lucide-react";

interface Tier {
  name: string;
}

interface StatsCardsProps {
  totalPoints: number;
  tier: Tier;
  rank: string | null;
}

export function StatsCards({ totalPoints, tier, rank }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <Card className="flex h-full flex-col items-start rounded-2xl bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
        <div className="flex w-full items-center justify-between pb-4">
          <CardDescription className="text-base font-medium text-[#595c5e]">
            Impact Points
          </CardDescription>
          <Star className="h-4.25 w-4.25 shrink-0 text-[#f59e0b]" />
        </div>
        <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#1d283a]">
          {totalPoints}
        </CardTitle>
      </Card>

      <Card className="flex h-full flex-col items-start justify-between rounded-2xl bg-white p-6 shadow-[0px_4px_10px_rgba(0,0,0,0.03)]">
        <div className="flex w-full items-center justify-between pb-4">
          <CardDescription className="text-base font-medium text-[#595c5e]">
            Current Tier
          </CardDescription>
          <Award className="h-5.25 w-4 shrink-0 text-[#cd7f32]" />
        </div>
        <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#1d283a]">
          {tier.name}
        </CardTitle>
        <div className="mt-6 flex w-full flex-col gap-2">
          <div className="h-2 w-full rounded-full bg-[#f1f5f9]" />
          <p className="text-[10px] leading-3.75 text-[#94a3b8]">
            Next tier: Silver (100 pts)
          </p>
        </div>
      </Card>

      <Card className="flex h-full flex-col items-start rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
        <div className="flex w-full items-center justify-between pb-4">
          <CardDescription className="text-base font-medium text-[#595c5e]">
            Current Rank
          </CardDescription>
          <Trophy className="h-5 w-5 shrink-0 text-[#fbbf24]" />
        </div>
        <CardTitle className="w-full text-[32px] font-bold leading-12 text-[#0f172a]">
          {rank || "#-"}
        </CardTitle>
      </Card>
    </div>
  );
}