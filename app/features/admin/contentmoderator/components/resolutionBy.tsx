import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import type { ContentModeratorReport } from "~/types/api-client";

export function ResolutionLog({ report }: { report: ContentModeratorReport }) {
  const solvedByName = [report.solvedBy?.firstName, report.solvedBy?.lastName]
    .filter(Boolean)
    .join(" ");
  {
    solvedByName || "Unknown moderator";
  }
  return (
    <div className="p-5 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50 rounded-2xl space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          Resolved By
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="shrink-0 w-8 h-8 border border-slate-200 dark:border-slate-700">
          <AvatarFallback className="text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-400">
            {report.solvedBy?.firstName?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-sm font-semibold text-(--admin-text) truncate">
              {solvedByName}
            </p>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wide dark:bg-green-600/20 bg-green-100 text-green-600 dark:text-green-400`}
            >
              {report.confirmStatus}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-(--admin-text-secondary) font-medium">
              Platform Moderator
            </p>
            <span className="text-[10px] text-(--admin-text-secondary) font-medium lowercase first-letter:uppercase">
              {report.solvedAt ? formatMinutesOrHoursAgo(report.solvedAt) : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
