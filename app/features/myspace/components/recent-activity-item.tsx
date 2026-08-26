import { ChevronRight } from "lucide-react";
import type { RecentActivity } from "~/features/myspace/types";
import {
  getActivityTypeConfig,
  getActivityIconColor,
} from "../lib/activity-type-handler";
import { formatMinutesOrHoursAgo } from "~/lib/time";

interface RecentActivityItemProps {
  activity: RecentActivity;
  onClick?: () => void;
}

export function RecentActivityItem({
  activity,
  onClick,
}: RecentActivityItemProps) {
  const config = getActivityTypeConfig(activity.type);
  const iconColor = getActivityIconColor(activity.type);
  const Icon = config.icon;

  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#f1f5f9] p-4 transition-colors hover:bg-[#f8fafc]"
    >
      {/* Icon Container */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
        style={{ backgroundColor: config.bgColor }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 text-start">
        <p className="line-clamp-1 text-sm font-semibold text-[#030213]">
          {activity.title}
        </p>
        {activity.description && (
          <p className="mt-1 line-clamp-2 text-xs text-[#65758b]">
            {activity.description}
          </p>
        )}
      </div>

      {/* Timestamp and Chevron */}
      <div className="flex shrink-0 items-center gap-2">
        <p className="text-xs whitespace-nowrap text-[#9eacc0]">
          {formatMinutesOrHoursAgo(activity.createdAt)}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-[#94a3b8] opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
