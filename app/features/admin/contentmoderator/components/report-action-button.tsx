import { Trash2, XCircle } from "lucide-react";

interface ReportActionsProps {
  onAction: (action: "dismiss" | "hide") => void;
}

export function ReportActionButton({ onAction }: ReportActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <button
        onClick={() => onAction("dismiss")}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-(--admin-border) bg-(--admin-card-bg) p-3.5 text-left transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
      >
        <XCircle className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-300" />

        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Dismiss Report
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No violation found
          </p>
        </div>
      </button>

      <button
        onClick={() => onAction("hide")}
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-(--admin-border) bg-(--admin-card-bg) p-3.5 text-left transition-all hover:border-rose-300 hover:bg-rose-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-rose-950/70"
      >
        <Trash2 size={20} className="shrink-0 text-rose-500" />
        <div>
          <h4 className="mb-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
            Hide
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Remove from feed
          </p>
        </div>
      </button>
    </div>
  );
}
