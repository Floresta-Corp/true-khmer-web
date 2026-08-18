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
        <Skeleton className="mx-auto h-3 w-12 rounded dark:bg-slate-700" />
      </TableCell>

      {/* Type */}
      <TableCell className="text-center align-middle">
        <Skeleton className="mx-auto h-5 w-20 rounded-md dark:bg-slate-700" />
      </TableCell>

      {/* Content Preview */}
      <TableCell className="min-w-0 px-5 py-4 align-middle">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 rounded dark:bg-slate-700" />
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="size-5 shrink-0 rounded-full dark:bg-slate-700" />
            <Skeleton className="h-3 w-28 rounded dark:bg-slate-700" />
          </div>
        </div>
      </TableCell>

      {/* Date & Time */}
      <TableCell className="px-5 py-4 text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-3 w-3.5 rounded-full dark:bg-slate-700" />
          <Skeleton className="h-3 w-20 rounded dark:bg-slate-700" />
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="px-5 py-4 text-center align-middle">
        <Skeleton className="mx-auto h-5 w-16 rounded-full dark:bg-slate-700" />
      </TableCell>

      {/* Action */}
      <TableCell className="px-5 py-4 text-right align-middle">
        <Skeleton className="ml-auto h-5 w-5 rounded-full dark:bg-slate-700" />
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
          <TableRow className="border-b border-slate-50 hover:bg-transparent dark:border-slate-800 dark:hover:bg-transparent">
            {COLUMNS.map((col) => (
              <TableHead
                key={col.label}
                className={`px-5 py-4 text-[12px] font-semibold tracking-wide text-slate-400 uppercase dark:text-slate-500 ${col.align}`}
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
