import type { ReportStatus } from "~/features/admin/contentmoderator/types";

// ── Status colors for status labels ───────────────────────────────────────
const STATUS_STYLES: Record<ReportStatus, string> = {
  open: "bg-rose-500/10 text-rose-400 border border-rose-800/50",
  closed: "bg-emerald-500/10 text-emerald-400 border border-emerald-800/50",
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
