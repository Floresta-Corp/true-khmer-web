import { Trash2, XCircle, type LucideIcon } from "lucide-react";
import { formatDateTime } from "~/lib/time";
import type { ContentModeratorReport } from "~/types/api-client";

interface ResolutionStatusConfig {
  icon: LucideIcon;
  title: string;
  badge: string;
  iconWrap: string;
  badgeClass: string;
}

const RESOLUTION_STATUS: Record<
  "CONTENT HIDDEN" | "DISMISSED",
  ResolutionStatusConfig
> = {
  "CONTENT HIDDEN": {
    icon: Trash2,
    title: "Content removed",
    badge: "Violation confirmed",
    iconWrap:
      "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    badgeClass:
      "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400",
  },
  DISMISSED: {
    icon: XCircle,
    title: "Report dismissed",
    badge: "No violation found",
    iconWrap:
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
    badgeClass:
      "bg-gray-100 text-gray-700 dark:bg-gray-950/40 dark:text-gray-300",
  },
};

export function ResolutionStatusRow({
  report,
}: {
  report: ContentModeratorReport;
}) {
  const status = report.confirmStatus ?? "DISMISSED";
  const {
    icon: Icon,
    title,
    badge,
    iconWrap,
    badgeClass,
  } = RESOLUTION_STATUS[status] ?? RESOLUTION_STATUS.DISMISSED;

  const fullName =
    `${report.solvedBy?.firstName ?? ""} ${report.solvedBy?.lastName ?? ""}`.trim();
  const solvedAt = formatDateTime(report.solvedAt);

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconWrap}`}
        >
          <Icon size={18} strokeWidth={2.25} />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-[15px] font-semibold text-(--admin-text)">
            {title}
          </p>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
          >
            {badge}
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right text-[12px] text-(--admin-text-secondary)">
        {solvedAt ? <p>{solvedAt}</p> : null}
        {fullName ? <p>by {fullName}</p> : null}
      </div>
    </div>
  );
}
