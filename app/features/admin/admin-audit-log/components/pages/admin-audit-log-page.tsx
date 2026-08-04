import { useLoaderData, useLocation, useNavigation } from "react-router";

import { AdminAuditLogEmptyState } from "../admin-audit-log-empty-state";
import { AdminAuditLogHeader } from "../admin-audit-log-header";
import {
  AdminAuditLogPagination,
  AdminAuditLogPaginationSkeleton,
} from "../admin-audit-log-pagination";
import {
  AdminAuditLogTable,
  AdminAuditLogTableSkeleton,
} from "../admin-audit-log-table";
import { AdminAuditLogToolbar } from "../admin-audit-log-toolbar";
import type { AdminAuditLogLoaderData } from "../../types";

export default function AdminAuditLogPage() {
  const { entries, members, pagination } =
    useLoaderData<AdminAuditLogLoaderData>();
  const location = useLocation();
  const navigation = useNavigation();

  const isLoadingEntries =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-10 lg:py-8 dark:bg-slate-950">
      <div className="max-w-full">
        <AdminAuditLogHeader />

        <section
          className="flex h-[clamp(32rem,calc(100dvh-12rem),48rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-busy={isLoadingEntries}
        >
          <AdminAuditLogToolbar members={members} />

          {isLoadingEntries ? (
            <>
              <AdminAuditLogTableSkeleton rows={8} />
              <AdminAuditLogPaginationSkeleton />
            </>
          ) : entries.length > 0 ? (
            <>
              <AdminAuditLogTable entries={entries} />
              <AdminAuditLogPagination {...pagination} />
            </>
          ) : (
            <AdminAuditLogEmptyState />
          )}
        </section>
      </div>
    </main>
  );
}
