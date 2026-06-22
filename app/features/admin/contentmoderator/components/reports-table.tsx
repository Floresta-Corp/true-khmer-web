import { ArrowRight, Clock } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { EmptyState } from "./empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { ContentModeratorReport } from "~/types/api-client";
import { formatDateMonthYear } from "~/features/events/lib/event-formatters";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";

interface ReportsTableProps {
  reports: ContentModeratorReport[];
  onSelect: (report: ContentModeratorReport) => void;
}

interface ReportRowProps {
  report: ContentModeratorReport;
  onSelect: (report: ContentModeratorReport) => void;
}

function ReportRow({ report, onSelect }: ReportRowProps) {
  return (
    <TableRow
      onClick={() => onSelect(report)}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
    >
      <TableCell className="text-center align-middle">
        <span className="text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors tracking-widest">
          REP-{String(report.reportId).padStart(3, "0")}
        </span>
      </TableCell>

      <TableCell className="text-center align-middle">
        <span className="px-2 py-1.5 text-[11px] font-bold rounded-md border bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700">
          {report.type.name}
        </span>
      </TableCell>

      <TableCell className="px-10 py-6 min-w-0 align-middle">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-slate-200 dark:border-blue-600/20">
              {report.reportType}
            </span>
            <p className="min-w-0 text-sm font-semibold text-slate-900 dark:text-white leading-tight truncate">
              "{report.contentPreview}"
            </p>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="shrink-0 size-5 border  dark:border-slate-700">
              <AvatarImage
                src={resolveImageURL(report.reportingBy?.avatarKey)}
                alt={report.reportingBy?.name}
              />
              <AvatarFallback className="text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-400">
                {report.reportingBy?.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 text-[11px] font-medium text-slate-400 truncate">
              Reported by {report.reportingBy?.name}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-10 py-6 text-center text-xs font-medium text-slate-400 align-middle">
        <div className="flex items-center justify-center gap-2">
          <Clock size={14} />
          <span>{formatDateMonthYear(report.dateTime)}</span>
        </div>
      </TableCell>

      <TableCell className="px-10 py-6 text-center align-middle">
        <StatusBadge status={report.status} />
      </TableCell>

      <TableCell className="px-10 py-6 text-right align-middle">
        <button
          type="button"
          aria-label="Open report details"
          className="p-2 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowRight size={20} />
        </button>
      </TableCell>
    </TableRow>
  );
}
const COLUMNS = [
  { label: "ID", width: "10%", align: "text-center" },
  { label: "Type", width: "14%", align: "text-center" },
  { label: "Content Preview", width: "34%", align: "text-left" },
  { label: "Date & Time", width: "16%", align: "text-center" },
  { label: "Status", width: "18%", align: "text-center" },
  { label: "Action", width: "8%", align: "text-center" },
];

export function ReportsTable({ reports, onSelect }: ReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-225 table-fixed border-collapse">
        <colgroup>
          {COLUMNS.map((col) => (
            <col key={col.label} style={{ width: col.width }} />
          ))}
        </colgroup>

        <TableHeader>
          <TableRow className="border-b border-slate-50 dark:border-slate-800 hover:bg-transparent dark:hover:bg-transparent">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.label}
                className={`px-10 py-6 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ${col.align}`}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {reports.length > 0 ? (
            reports.map((report) => (
              <ReportRow key={report.id} report={report} onSelect={onSelect} />
            ))
          ) : (
            <TableRow>
              <TableCell
                className="pointer-events-none"
                colSpan={COLUMNS.length}
              >
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
