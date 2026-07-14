import { useEffect, useRef, useState } from "react";
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
import { formatEventDateTime } from "~/features/events/lib/event-formatters";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn, resolveImageURL } from "~/lib/utils";
import { ReportTypeBadge } from "./report-type-badge";
import { highlightReportClassName } from "../utils";

interface ReportsTableProps {
  reports: ContentModeratorReport[];
  onSelect: (report: ContentModeratorReport) => void;
  highlightedReportId?: string | null;
}

interface ReportRowProps {
  report: ContentModeratorReport;
  onSelect: (report: ContentModeratorReport) => void;
  highlightedReportId?: string | null;
}

function getSubTypeColor(subType: "QUESTION" | "ANSWER" | null) {
  if (!subType) return null;

  const map = {
    QUESTION: {
      badge:
        "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900",
      label: "Question",
    },
    ANSWER: {
      badge:
        "bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-900",
      label: "Answer",
    },
  };

  return map[subType];
}

function ReportRow({ report, onSelect, highlightedReportId }: ReportRowProps) {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const isHighlighted = highlightedReportId === report.id;
  useEffect(() => {
    if (!isHighlighted) {
      setShowAnimation(false);
      return;
    }
    const scrollTimer = setTimeout(() => {
      rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    setShowAnimation(true);
    const fadeTimer = setTimeout(() => setShowAnimation(false), 1500);
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(fadeTimer);
    };
  }, [isHighlighted]);

  return (
    <TableRow
      ref={rowRef}
      id={`report-${report.id}`}
      onClick={() => onSelect(report)}
      className={cn(
        "group cursor-pointer transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30",
        showAnimation && highlightReportClassName,
      )}
    >
      <TableCell className="text-center align-middle">
        <span className="text-xs font-medium tracking-wide text-slate-400 transition-colors group-hover:text-blue-600">
          REP-{String(report.reportId).padStart(3, "0")}
        </span>
      </TableCell>

      <TableCell className="text-center align-middle">
        <ReportTypeBadge typeName={report.type?.name ?? null} />
      </TableCell>

      <TableCell className="min-w-0 px-5 py-4 align-middle">
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="rounded-lg border border-slate-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-blue-500 uppercase dark:border-blue-600/20 dark:bg-blue-900/20">
              {report.reportType}
            </span>
            {report.reportSubType &&
              (() => {
                const sub = getSubTypeColor(report.reportSubType);
                return sub ? (
                  <span
                    className={`rounded-lg border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${sub.badge}`}
                  >
                    {sub.label}
                  </span>
                ) : null;
              })()}
            <p className="min-w-0 truncate text-sm leading-tight font-medium text-slate-900 italic dark:text-white">
              "{report.contentPreview}"
            </p>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-5 shrink-0 border dark:border-slate-700">
              <AvatarImage
                src={resolveImageURL(report.reportingBy?.avatarKey)}
                alt={report.reportingBy?.name}
              />
              <AvatarFallback className="bg-slate-100 text-xs font-black text-slate-400 dark:bg-slate-800">
                {report.reportingBy?.name?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 truncate text-xs text-slate-400">
              Reported by {report.reportingBy?.name}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="px-5 py-4 text-center align-middle text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2">
          <Clock size={14} />
          <span>{formatEventDateTime(report.dateTime)}</span>
        </div>
      </TableCell>

      <TableCell className="px-5 py-4 text-center align-middle">
        <StatusBadge status={report.status} />
      </TableCell>

      <TableCell className="px-5 py-4 text-right align-middle">
        <button
          type="button"
          aria-label="Open report details"
          className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-slate-900"
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

export function ReportsTable({
  reports,
  onSelect,
  highlightedReportId,
}: ReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-225 table-fixed border-collapse">
        <colgroup>
          {COLUMNS.map((col) => (
            <col key={col.label} style={{ width: col.width }} />
          ))}
        </colgroup>

        <TableHeader>
          <TableRow className="border-b border-slate-100 hover:bg-transparent dark:border-slate-800 dark:hover:bg-transparent">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.label}
                className={`px-5 py-4 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400 ${col.align}`}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
          {reports.length > 0 ? (
            reports.map((report) => (
              <ReportRow
                key={report.id}
                report={report}
                onSelect={onSelect}
                highlightedReportId={highlightedReportId}
              />
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
