import { Sparkles, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Tier } from "~/services/myspace/types";

interface ActivityStatsProps {
  totalPoints: number;
  tier: Tier;
  rank: string | null;
}

export function StatsCards({ totalPoints, tier, rank }: ActivityStatsProps) {
  return (
    <Card className="w-full rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
      <CardHeader className="p-0 pb-5">
        <CardTitle className="text-base flex items-center gap-2 font-semibold tracking-tight text-[#0f172a]">
          <Trophy className="text-yellow-500" /> Community Standing
        </CardTitle>
        <Separator />
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-4 p-0">
        {/* points */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#f8fafc] py-5 px-4 text-center">
          <span className="text-sm lg:text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
            Points
          </span>
          <span className="text-xl font-semibold text-[#2563eb]">
            {totalPoints}
          </span>
        </div>

        {/* rank Card */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#f8fafc] py-5 px-4 text-center">
          <span className="text-sm lg:text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
            Rank
          </span>
          <span className="text-xl font-semibold ">
            {rank ? `#${rank}` : "-"}
          </span>
        </div>

        {/* tier Card */}
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#f8fafc] py-5 px-4 text-center">
          <span className="text-sm lg:text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#94a3b8]">
            Tier
            <Sparkles className="size-3 text-yellow-500" />
          </span>
          <span className="text-lg font-semibold text-[#0f172a]">
            {tier.name}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
