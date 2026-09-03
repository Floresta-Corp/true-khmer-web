import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  HandHeart,
  Rocket,
  Users,
} from "lucide-react";
import { Badge as StatusBadge } from "~/components/ui/badge";
import { Card, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { Badge as MyspaceBadge } from "~/features/myspace/types";
import { cn } from "~/lib/utils";
import { formatShortDate } from "~/features/events/lib/event-formatters";

type BadgeStyle = {
  icon: LucideIcon;
  colorClassName: string;
};

type AchievementsCardProps = {
  badges: MyspaceBadge[];
};

const categoryStyles: Record<MyspaceBadge["category"], BadgeStyle> = {
  COLLABORATION: {
    icon: Users,
    colorClassName: "text-[#5b5cff]",
  },
  KNOWLEDGE: {
    icon: BookOpen,
    colorClassName: "text-[#9b4dff]",
  },
  LAUNCHPAD: {
    icon: Rocket,
    colorClassName: "text-[#2f75ff]",
  },
  ONBOARDING: {
    icon: BadgeCheck,
    colorClassName: "text-[#16a34a]",
  },
  VOLUNTEER: {
    icon: HandHeart,
    colorClassName: "text-[#ff9f0a]",
  },
};

export function MyAchievementsCard({ badges }: AchievementsCardProps) {
  const previewBadges = badges.slice(0, 4);

  return (
    <Dialog>
      <Card className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-none">
        <div className="mb-5 flex items-center justify-between gap-2 border-b pb-3">
          <div className="flex min-w-0 items-center gap-2">
            <Award className="size-4.5 shrink-0 text-indigo-400" />
            <span className="truncate text-base font-semibold tracking-tight text-[#0f172a]">
              My Achievements
            </span>
          </div>

          {badges.length > 0 && (
            <DialogTrigger asChild>
              <button
                type="button"
                className="shrink-0 cursor-pointer text-sm font-bold text-blue-500 transition-colors hover:text-blue-600"
              >
                View all
              </button>
            </DialogTrigger>
          )}
        </div>

        {badges.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {previewBadges.map((badge) => (
              <BadgePreviewTile key={badge.slug} badge={badge} />
            ))}
          </div>
        ) : (
          <div className="relative flex min-h-45 flex-col items-center justify-center py-2 text-center">
            <Award className="mb-2 h-8 w-6 shrink-0 text-gray-400" />
            <p className="text-sm font-semibold text-gray-400">No medals yet</p>
            <p className="pt-2 text-sm text-gray-400">
              Complete profile actions and contributions to earn badges.
            </p>
          </div>
        )}
      </Card>

      <DialogContent className="max-h-[86vh] overflow-hidden rounded-3xl border-none p-0 sm:max-w-180 [&>button]:top-5 [&>button]:right-5 [&>button]:rounded-full [&>button]:border [&>button]:border-[#e6ebf2] [&>button]:bg-white [&>button]:text-[#94a3b8]">
        <div className="overflow-y-auto p-5 sm:p-8">
          <DialogHeader className="mb-6 border-b border-[#edf1f6] pb-5">
            <div className="flex items-start gap-4 pr-10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0ff]">
                <Award className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-2xl leading-8 font-semibold text-[#020617]">
                  My Badge & Achievements Portfolio
                </DialogTitle>
                <DialogDescription className="mt-1 text-sm font-semibold text-[#8a99b5]">
                  Explore your accomplishments and unlocked badges
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map((badge) => (
              <BadgePortfolioTile key={badge.slug} badge={badge} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BadgePreviewTile({ badge }: { badge: MyspaceBadge }) {
  const { icon: Icon, colorClassName } = getBadgeStyle(badge);

  return (
    <div className="flex min-h-27.5 flex-col items-center justify-center rounded-3xl border border-[#eef2f7] bg-[#f8fafc] px-3 py-4 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#eef2f7] bg-white">
        <Icon className={cn("h-5 w-5", colorClassName)} />
      </div>
      <h3 className="max-w-full text-sm leading-5 font-extrabold text-[#0f172a]">
        {badge.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-4 font-bold text-[#8a99b5]">
        {getBadgeSubtitle(badge)}
      </p>
    </div>
  );
}

function BadgePortfolioTile({ badge }: { badge: MyspaceBadge }) {
  const { icon: Icon, colorClassName } = getBadgeStyle(badge);

  return (
    <div className="flex min-h-41 gap-4 rounded-3xl border border-[#e2e8f0] bg-white p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl border border-[#eef2f7] bg-white">
        <Icon className={cn("h-6 w-6", colorClassName)} />
      </div>

      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="text-base leading-5 font-semibold text-[#0f172a]">
            {badge.name}
          </h3>
          <StatusBadge className="border-[#dfe5ff] bg-[#eef0ff] px-2 py-0 text-[9px] leading-4 font-extrabold text-[#4f46ff] uppercase hover:bg-[#eef0ff]">
            Unlocked
          </StatusBadge>
        </div>

        <p className="text-sm leading-5 font-semibold text-[#0757ff]">
          {getBadgeSubtitle(badge)}
        </p>
        <p className="mt-1 text-[14px] leading-6 font-semibold text-[#475569]">
          {badge.description}
        </p>
        <p className="mt-3 text-[11px] leading-4 font-semibold tracking-[0.12em] text-[#8a99b5]">
          Earned {formatShortDate(badge.awardedAt)}
        </p>
      </div>
    </div>
  );
}

function getBadgeStyle(badge: MyspaceBadge): BadgeStyle {
  return {
    ...categoryStyles[badge.category],
  };
}

function getBadgeSubtitle(badge: MyspaceBadge) {
  return badge.category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
