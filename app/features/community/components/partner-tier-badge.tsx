import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const TIER_BADGE_CLASSES: Record<string, string> = {
  Platinum:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  Gold: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  Silver:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300",
  Bronze:
    "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Government:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  SME: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-300",
  Video:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/50 dark:text-purple-300",
  Free: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
};

export function PartnerTierBadge({
  tier,
  className,
}: {
  tier: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        TIER_BADGE_CLASSES[tier] ?? TIER_BADGE_CLASSES.Free,
        className,
      )}
    >
      {tier}
    </Badge>
  );
}
