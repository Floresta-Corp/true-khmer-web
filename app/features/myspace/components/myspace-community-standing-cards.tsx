import { Sparkles, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import type { Tier } from "~/services/myspace/types";

interface ActivityStatsProps {
  totalPoints: number;
  tier: Tier;
  rank: string | null;
}

export function CommunityStandingCard({
  totalPoints,
  tier,
  rank,
}: ActivityStatsProps) {
  return (
    <Card className="w-full rounded-3xl border shadow-none bg-white p-6 ">
      <CardHeader className="p-0 pb-5">
        <CardTitle className="flex items-center gap-2 font-semibold tracking-tight text-[#0f172a] text-base">
          <Trophy className="text-yellow-500 size-4.5" />
          Community Standing
        </CardTitle>
        <Separator />
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-4 p-0">
        {/* points */}
        <div className="flex flex-col items-center justify-center border border-[#e2e8f0] gap-2 rounded-3xl bg-[#f8fafc] py-3 px-5 text-center">
          <span className="text-sm lg:text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
            Points
          </span>
          <span className="text-lg font-semibold text-[#2563eb]">
            {totalPoints}
          </span>
        </div>

        {/* rank Card */}
        <div className="flex flex-col items-center justify-center border border-[#e2e8f0] gap-2 rounded-3xl bg-[#f8fafc] py-3 px-5 text-center">
          <span className="text-sm lg:text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
            Rank
          </span>
          <span className="text-lg font-semibold ">
            {rank ? `#${rank}` : "-"}
          </span>
        </div>

        {/* tier Card */}
        <div className="flex flex-col items-center justify-center border border-[#e2e8f0] gap-2 rounded-3xl  bg-[#f8fafc] py-3 px-5 text-center">
          <span className="text-sm lg:text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#94a3b8]">
            Tier
            <Sparkles className="size-3 text-yellow-500" />
          </span>
          <span className="font-semibold text-[#0f172a]">{tier.name}</span>
        </div>
      </CardContent>
    </Card>
  );
}
