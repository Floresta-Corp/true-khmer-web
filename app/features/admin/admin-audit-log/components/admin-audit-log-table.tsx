import { Skeleton } from "~/components/ui/skeleton";
import {
  AdminHeaderCell,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderRow,
  AdminTableRow,
} from "~/features/admin/components/admin-table";
import type { AdminAuditLogEntry } from "~/types/api-client";
import { AdminAuditLogActorCell } from "./admin-audit-log-actor-cell";
import { AdminAuditLogCategoryBadge } from "./admin-audit-log-category-badge";
import { formatDateTime } from "~/lib/time";

function AdminAuditLogTableHead() {
  return (
    <AdminTableHead>
      <AdminTableHeaderRow>
        <AdminHeaderCell label="Name" className="w-[24%]" />
        <AdminHeaderCell label="Action" className="w-[28%]" />
        <AdminHeaderCell label="Category" className="w-[13%]" />
        <AdminHeaderCell label="IP Address" className="w-[16%]" />
        <AdminHeaderCell label="Timestamp" className="w-[19%]" />
      </AdminTableHeaderRow>
    </AdminTableHead>
  );
}

export function AdminAuditLogTable({
  entries,
}: {
  entries: AdminAuditLogEntry[];
}) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <AdminTable className="min-w-200 table-fixed">
        <AdminAuditLogTableHead />
        <AdminTableBody>
          {entries.map((entry) => (
            <AdminTableRow key={entry.id}>
              <AdminAuditLogActorCell admin={entry.actor} />
              <AdminTableCell className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                  {entry.summary}
                </p>
                {entry.detail ? (
                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                    {entry.detail}
                  </p>
                ) : null}
              </AdminTableCell>
              <AdminTableCell>
                <AdminAuditLogCategoryBadge category={entry.category} />
              </AdminTableCell>
              <AdminTableCell className="text-sm text-slate-600 tabular-nums dark:text-slate-300">
                {entry.ipAddress || "-"}
              </AdminTableCell>
              <AdminTableCell className="text-sm whitespace-nowrap text-slate-500 dark:text-slate-400">
                {formatDateTime(entry.createdAt)}
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}

export function AdminAuditLogTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      className="min-h-0 flex-1 overflow-auto"
      aria-label="Loading audit log entries"
    >
      <AdminTable className="min-w-200 table-fixed">
        <AdminAuditLogTableHead />
        <AdminTableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <AdminTableRow className="h-18" key={index}>
              <AdminTableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 max-w-full rounded" />
                    <Skeleton className="h-3 w-20 max-w-full rounded" />
                  </div>
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40 max-w-full rounded" />
                  <Skeleton className="h-3 w-28 max-w-full rounded" />
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <Skeleton className="h-6 w-20 rounded-lg" />
              </AdminTableCell>
              <AdminTableCell>
                <Skeleton className="h-4 w-24 rounded" />
              </AdminTableCell>
              <AdminTableCell>
                <Skeleton className="h-4 w-32 rounded" />
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </div>
  );
}
