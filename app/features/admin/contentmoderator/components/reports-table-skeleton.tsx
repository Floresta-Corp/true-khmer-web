import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const COLUMNS = [
  { label: "ID", width: "10%", align: "text-center" },
  { label: "Type", width: "14%", align: "text-center" },
  { label: "Content Preview", width: "34%", align: "text-left" },
  { label: "Date & Time", width: "16%", align: "text-center" },
  { label: "Status", width: "18%", align: "text-center" },
  { label: "Action", width: "8%", align: "text-center" },
];

function ReportSkeletonRow() {
  return (
    <TableRow className="pointer-events-none">
      {/* ID */}
      <TableCell className="text-center align-middle">
        <Skeleton className="mx-auto h-3 w-12 dark:bg-slate-700  rounded" />
      </TableCell>

      {/* Type */}
      <TableCell className="text-center align-middle">
        <Skeleton className="mx-auto h-5 w-20 dark:bg-slate-700 rounded-md" />
      </TableCell>

      {/* Content Preview */}
      <TableCell className="px-10 py-6 min-w-0 align-middle">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 dark:bg-slate-700 rounded" />
          <div className="flex items-center gap-2 min-w-0">
            <Skeleton className="size-5 shrink-0 dark:bg-slate-700 rounded-full" />
            <Skeleton className="h-3 w-28 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </TableCell>

      {/* Date & Time */}
      <TableCell className="px-10 py-6 text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-3 w-3.5 dark:bg-slate-700 rounded-full" />
          <Skeleton className="h-3 w-20 dark:bg-slate-700 rounded" />
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="px-10 py-6 text-center align-middle">
        <Skeleton className="mx-auto h-5 w-16 dark:bg-slate-700 rounded-full" />
      </TableCell>

      {/* Action */}
      <TableCell className="px-10 py-6 text-right align-middle">
        <Skeleton className="ml-auto h-5 w-5 dark:bg-slate-700 rounded-full" />
      </TableCell>
    </TableRow>
  );
}

export function ReportsTableSkeleton({ rows = 6 }: { rows?: number }) {
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
          {Array.from({ length: rows }).map((_, index) => (
            <ReportSkeletonRow key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
