import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Briefcase,
  Clock,
  MessageCircle,
  MessageSquare,
  Star,
  ThumbsUp,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import type { NotificationIconName } from "~/features/notifications/types";

export const NOTIFICATION_ICON_STYLE_MAP: Record<
  NotificationIconName,
  { bg: string; fg: string }
> = {
  User: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  MessageSquare: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  MessageCircle: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  ThumbsUp: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  Trophy: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  Clock: { bg: "bg-[#FFDB430D]", fg: "text-[#FFB366]" },
  Briefcase: { bg: "bg-[#F0FDF4]", fg: "text-[#1FC16B]" },
  Zap: { bg: "bg-[#D5EDFF]", fg: "text-[#2F6FE4]" },
  Star: { bg: "bg-amber-50", fg: "text-amber-500" },
  Bell: { bg: "bg-gray-100", fg: "text-gray-600" },
};

/**
 * Gradient accent per icon type, used by the SSE notification toast
 * (icon chip, top strip, and progress bar). Hues mirror the `fg` colors
 * above so a streamed toast matches its notification's list styling.
 */
export const NOTIFICATION_ICON_ACCENT_MAP: Record<
  NotificationIconName,
  string
> = {
  User: "from-[#2F6FE4] to-[#1E5AD0]",
  MessageSquare: "from-[#2F6FE4] to-[#1E5AD0]",
  MessageCircle: "from-[#2F6FE4] to-[#1E5AD0]",
  ThumbsUp: "from-[#2F6FE4] to-[#1E5AD0]",
  Trophy: "from-[#2F6FE4] to-[#1E5AD0]",
  Clock: "from-[#FFB366] to-[#F59E0B]",
  Briefcase: "from-[#1FC16B] to-[#16A34A]",
  Zap: "from-[#2F6FE4] to-[#1E5AD0]",
  Star: "from-amber-400 to-amber-600",
  Bell: "from-gray-500 to-gray-700",
};

const NOTIFICATION_ICON_COMPONENT_MAP: Record<
  NotificationIconName,
  LucideIcon
> = {
  User,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  Trophy,
  Clock,
  Briefcase,
  Zap,
  Star,
  Bell,
};

export function NotificationTypeIcon({
  iconName,
  className,
}: {
  iconName: NotificationIconName;
  className: string;
}) {
  const Icon = NOTIFICATION_ICON_COMPONENT_MAP[iconName];

  return <Icon className={className} />;
}
