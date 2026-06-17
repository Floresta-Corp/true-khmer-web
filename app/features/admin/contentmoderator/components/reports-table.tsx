import type { Report } from "~/features/admin/contentmoderator/types";
import { memo } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { EmptyState } from "./empty-state";

interface ReportsTableProps {
  reports: Report[];
  onSelect: (report: Report) => void;
}

interface ReportRowProps {
  report: Report;
  onSelect: (report: Report) => void;
}

const COLUMN_WIDTHS = ["10%", "14%", "34%", "16%", "18%", "8%"];

function ReportRow({ report, onSelect }: ReportRowProps) {
  return (
    <tr
      onClick={() => onSelect(report)}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group"
    >
      <td className="text-center align-middle">
        <span className="text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors tracking-widest">
          {report.id}
        </span>
      </td>

      <td className="text-center align-middle">
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full border bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700">
          {report.category}
        </span>
      </td>

      <td className="px-10 py-6 min-w-0 align-middle">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full border bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800">
              {report.source}
            </span>
            <p className="min-w-0 text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
              "{report.target.preview}"
            </p>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-black border border-slate-100 dark:border-slate-800">
              {report.reporterAvatar}
            </div>
            <span className="min-w-0 text-[11px] font-medium text-slate-400 truncate">
              Reported by {report.reporter}
            </span>
          </div>
        </div>
      </td>

      <td className="px-10 py-6 text-center text-xs font-medium text-slate-400 align-middle">
        <div className="flex items-center justify-center gap-2">
          <Clock size={14} />
          <span>{format(new Date(report.createdAt), "d MMM yyyy")}</span>
        </div>
      </td>

      <td className="px-10 py-6 text-center align-middle">
        <StatusBadge status={report.status} />
      </td>

      <td className="px-10 py-6 text-right align-middle">
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowRight size={20} />
        </button>
      </td>
    </tr>
  );
}

const HEADERS = [
  "ID",
  "Type",
  "Content Preview",
  "Date & Time",
  "Status",
  "Action",
];

export const ReportsTable = memo(function ReportsTable({
  reports,
  onSelect,
}: ReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-225 table-fixed text-left border-collapse">
        <colgroup>
          {COLUMN_WIDTHS.map((width) => (
            <col key={width} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-slate-50 dark:border-slate-800">
            {HEADERS.map((header, i) => (
              <th
                key={header || i}
                className={`px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest align-middle ${
                  i === HEADERS.length - 1 ? "text-right" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {reports.length > 0 ? (
            reports.map((report) => (
              <ReportRow key={report.id} report={report} onSelect={onSelect} />
            ))
          ) : (
            <tr>
              <td colSpan={6}>
                <EmptyState />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});
