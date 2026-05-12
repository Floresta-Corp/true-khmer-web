import { ChevronRight } from "lucide-react";
import type { RecentActivity } from "~/services/myspace/types/myspace-me-type";
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
      className="w-full flex items-center gap-3 p-4 rounded-xl border border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors cursor-pointer group"
    >
      {/* Icon Container */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-[14px] shrink-0"
        style={{ backgroundColor: config.bgColor }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-start">
        <p className="text-sm font-semibold text-[#030213] line-clamp-1">
          {activity.title}
        </p>
        {activity.description && (
          <p className="text-xs text-[#65758b] mt-1 line-clamp-2">
            {activity.description}
          </p>
        )}
      </div>

      {/* Timestamp and Chevron */}
      <div className="flex items-center gap-2 shrink-0">
        <p className="text-xs text-[#9eacc0] whitespace-nowrap">
          {formatMinutesOrHoursAgo(activity.createdAt)}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 text-[#94a3b8] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
