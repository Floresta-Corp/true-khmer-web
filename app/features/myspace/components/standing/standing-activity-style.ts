import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  HandHeart,
  MessageCircle,
  Rocket,
  ShoppingBag,
  Sparkles,
  Star,
  UserPlus,
  Users,
} from "lucide-react";

export interface ActivityStyle {
  icon: LucideIcon;
  /** Icon colour and the matching tinted chip behind it. */
  className: string;
  /** Solid colour for breakdown bars. */
  barClassName: string;
}

const DEFAULT_STYLE: ActivityStyle = {
  icon: Star,
  className: "bg-[#f1f5f9] text-[#64748b]",
  barClassName: "bg-[#94a3b8]",
};

// Keyed by the action type's prefix, so new action types inside a known area
// pick up that area's look without a code change.
const STYLES: [prefix: string, style: ActivityStyle][] = [
  [
    "forum",
    {
      icon: MessageCircle,
      className: "bg-[#eef2ff] text-[#5b5cff]",
      barClassName: "bg-[#5b5cff]",
    },
  ],
  [
    "volunteer",
    {
      icon: HandHeart,
      className: "bg-[#fff7ed] text-[#ff9f0a]",
      barClassName: "bg-[#ff9f0a]",
    },
  ],
  [
    "launchpad",
    {
      icon: Rocket,
      className: "bg-[#eff6ff] text-[#2f75ff]",
      barClassName: "bg-[#2f75ff]",
    },
  ],
  [
    "course",
    {
      icon: BookOpen,
      className: "bg-[#f5f3ff] text-[#9b4dff]",
      barClassName: "bg-[#9b4dff]",
    },
  ],
  [
    "resource",
    {
      icon: BookOpen,
      className: "bg-[#f5f3ff] text-[#9b4dff]",
      barClassName: "bg-[#9b4dff]",
    },
  ],
  [
    "event",
    {
      icon: CalendarDays,
      className: "bg-[#fdf2f8] text-[#db2777]",
      barClassName: "bg-[#db2777]",
    },
  ],
  [
    "khmer_talk",
    {
      icon: CalendarDays,
      className: "bg-[#fdf2f8] text-[#db2777]",
      barClassName: "bg-[#db2777]",
    },
  ],
  [
    "mentorship",
    {
      icon: Users,
      className: "bg-[#ecfeff] text-[#0891b2]",
      barClassName: "bg-[#0891b2]",
    },
  ],
  [
    "purchase",
    {
      icon: ShoppingBag,
      className: "bg-[#f0fdf4] text-[#16a34a]",
      barClassName: "bg-[#16a34a]",
    },
  ],
  [
    "merchant",
    {
      icon: ShoppingBag,
      className: "bg-[#f0fdf4] text-[#16a34a]",
      barClassName: "bg-[#16a34a]",
    },
  ],
  [
    "leave_review",
    {
      icon: ShoppingBag,
      className: "bg-[#f0fdf4] text-[#16a34a]",
      barClassName: "bg-[#16a34a]",
    },
  ],
  [
    "referral",
    {
      icon: UserPlus,
      className: "bg-[#ecfeff] text-[#0891b2]",
      barClassName: "bg-[#0891b2]",
    },
  ],
  [
    "welcome",
    {
      icon: BadgeCheck,
      className: "bg-[#f0fdf4] text-[#16a34a]",
      barClassName: "bg-[#16a34a]",
    },
  ],
  [
    "tier",
    {
      icon: Sparkles,
      className: "bg-[#fff7ed] text-[#ea580c]",
      barClassName: "bg-[#ea580c]",
    },
  ],
];

export function getActivityStyle(actionType: string): ActivityStyle {
  return (
    STYLES.find(([prefix]) => actionType.startsWith(prefix))?.[1] ??
    DEFAULT_STYLE
  );
}
