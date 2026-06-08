import { Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { RecentActivity } from "~/services/myspace/types/myspace-me-type";
import { RecentActivityItem } from "./recent-activity-item";
import { Card, CardTitle } from "~/components/ui/card";

interface RecentActivityListProps {
  activities: RecentActivity[];
  maxItems?: number;
  onActivityClick?: (activity: RecentActivity) => void;
}

export function RecentActivityList({
  activities,
  maxItems = 5,
  onActivityClick,
}: RecentActivityListProps) {
  const displayedActivities = activities.slice(0, Math.max(0, maxItems));

  if (!activities || activities.length === 0) {
    return (
      <Card className="overflow-clip rounded-3xl bg-white p-8 ">
        <div className="pb-8">
          <CardTitle className="text-[20px] font-semibold leading-7 text-[#111c2d]">
            Recent Activity
          </CardTitle>
        </div>

        <div className="rounded-2xl border border-[#f8fafc] px-px py-12.25">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 flex h-20 w-16 items-start justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1f5f9]">
                <Clock className="h-[22.5px] w-[22.5px] shrink-0 text-[#94a3b8]" />
              </div>
            </div>

            <p className="text-[16px] leading-6 text-[#64748b]">
              No activity yet
            </p>

            <p className="max-w-[320px] pt-1 text-center text-[14px] leading-5 text-[#94a3b8]">
              Start interacting with the community to see your history here.
            </p>

            <Link
              to="/forum"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold leading-5 text-[#2563eb]"
            >
              Visit community forum
              <ChevronRight className="h-2 w-2 shrink-0" />
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-clip rounded-3xl bg-white p-8">
      <div className="pb-8">
        <CardTitle className="text-[20px] font-semibold leading-7 text-[#111c2d]">
          Recent Activity
        </CardTitle>
      </div>

      <div className="space-y-4">
        {displayedActivities.map((activity) => (
          <RecentActivityItem
            key={activity.id}
            activity={activity}
            onClick={() => onActivityClick?.(activity)}
          />
        ))}
      </div>
    </Card>
  );
}
