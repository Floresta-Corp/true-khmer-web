import { Link } from "react-router";
import { Card, CardTitle } from "~/components/ui/card";
import { Medal } from "lucide-react";

export function AchievementsCard() {
  return (
    <Card>
      <div className="relative overflow-clip rounded-2xl bg-white p-6 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.03)]">
        <div className="pb-4">
          <CardTitle className="text-[20px] font-bold leading-7 text-[#2c2f31]">
            Achievements
          </CardTitle>
        </div>

        <div className="relative flex min-h-45 flex-col items-center justify-center py-2 text-center">
          <Medal className="mb-2 h-8 w-6 shrink-0 text-[#94a3b8]" />
          <p className="text-base text-[#64748b]">No medals yet</p>
          <Link
            to="#"
            className="pt-4 text-sm font-semibold text-[#2563eb]"
          >
            Browse achievements
          </Link>
        </div>
      </div>
    </Card>
  );
}