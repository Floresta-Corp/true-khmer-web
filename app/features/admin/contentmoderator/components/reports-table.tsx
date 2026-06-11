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

// ── ReportRow ─────────────────────────────────────────────────────────────
// Individual row in the reports table.

function ReportRow({ report, onSelect }: ReportRowProps) {
  return (
    <tr
      onClick={() => onSelect(report)}
      className="group hover:bg-(--admin-card-muted) transition-colors cursor-pointer"
    >
      {/* ID */}
      <td className="px-8 py-6">
        <span className="text-xs font-black text-(--admin-text-secondary) group-hover:text-blue-500 transition-colors tracking-widest">
          {report.id}
        </span>
      </td>

      {/* Type / Category */}
      <td className="px-8 py-6">
        <span className="text-[10px] font-black text-(--admin-text-secondary) uppercase tracking-widest bg-(--admin-card-muted) px-2 py-0.5 rounded w-fit border border-(--admin-border-strong)">
          {report.category}
        </span>
      </td>

      {/* Content Preview */}
      <td className="px-8 py-6 max-w-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-800/50">
              {report.source}
            </span>
            <p className="text-xs font-medium text-(--admin-text-secondary) line-clamp-1 italic">
              "{report.target.preview}"
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-(--admin-card-muted) text-(--admin-text-secondary) flex items-center justify-center text-[7px] font-black border border-(--admin-border-strong)">
              {report.reporterAvatar}
            </div>
            <span className="text-[10px] font-black text-(--admin-text-secondary) tracking-tighter">
              Reported by {report.reporter}
            </span>
          </div>
        </div>
      </td>

      {/* Date & Time */}
      <td className="px-8 py-6">
        <div className="flex items-center gap-2 text-(--admin-text-muted)">
          <Clock size={14} className="text-(--admin-text-secondary)" />
          <span className="text-xs font-medium">
            {format(new Date(report.createdAt), "MMM d, h:mm a")}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-8 py-6">
        <StatusBadge status={report.status} />
      </td>

      {/* Action */}
      <td className="px-8 py-6 text-right">
        <button className="w-8 h-8 bg-(--admin-card-muted) rounded-lg flex items-center justify-center text-(--admin-text-secondary) group-hover:bg-blue-600 group-hover:text-white transition-all ml-auto">
          <ArrowRight size={14} />
        </button>
      </td>
    </tr>
  );
}

// ── ReportsTable ─────────────────────────────────────────────────────────
// Displays the list of reports in a styled table.

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
    <div className="bg-(--admin-card-bg) rounded-xl border border-(--admin-border) overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-(--admin-header-bg) border-b border-(--admin-border)">
              {HEADERS.map((header, i) => (
                <th
                  key={header || i}
                  className={`px-8 py-5 text-[10px] font-black text-(--admin-text-secondary) uppercase tracking-widest ${
                    i === HEADERS.length - 1 ? "text-right" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--admin-border)">
            {reports.length > 0 ? (
              reports.map((report) => (
                <ReportRow
                  key={report.id}
                  report={report}
                  onSelect={onSelect}
                />
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
    </div>
  );
});
