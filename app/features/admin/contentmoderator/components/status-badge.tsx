import type { ReportStatus } from "~/features/admin/contentmoderator/types";

// ── Status colors for status labels ───────────────────────────────────────
const STATUS_STYLES: Record<ReportStatus, string> = {
  open: "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
  closed: "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
};

interface StatusBadgeProps {
  status: ReportStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[status]}`}
    >
      {status === "closed" ? "Closed" : "Open"}
    </span>
  );
}
