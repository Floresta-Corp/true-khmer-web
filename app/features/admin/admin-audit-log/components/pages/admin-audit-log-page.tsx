import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";

import { InfiniteScrollTrigger } from "~/components/infinite-scroll-trigger";
import { AdminAuditLogEmptyState } from "../admin-audit-log-empty-state";
import { AdminAuditLogHeader } from "../admin-audit-log-header";
import {
  AdminAuditLogTable,
  AdminAuditLogTableSkeleton,
} from "../admin-audit-log-table";
import { AdminAuditLogToolbar } from "../admin-audit-log-toolbar";
import type { AdminAuditLogLoaderData } from "../../types";

export default function AdminAuditLogPage() {
  const {
    entries: firstPageEntries,
    members,
    pagination: firstPagePagination,
    filters,
  } = useLoaderData<AdminAuditLogLoaderData>();
  const location = useLocation();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<AdminAuditLogLoaderData>();

  const [entries, setEntries] = useState(firstPageEntries);
  const [pagination, setPagination] = useState(firstPagePagination);

  // Identifies the active filter set — everything in the URL except the cursor.
  // A "load more" response may only be merged while this key is unchanged.
  const filtersKey = useMemo(() => {
    const next = new URLSearchParams(searchParams);
    next.delete("cursor");
    return next.toString();
  }, [searchParams]);

  const pendingFiltersKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Fresh loader data replaces the accumulated pages, so a "load more"
    // request still in flight belongs to the previous result set — drop it.
    pendingFiltersKeyRef.current = null;
    setEntries(firstPageEntries);
    setPagination(firstPagePagination);
  }, [firstPageEntries, firstPagePagination]);

  useEffect(() => {
    const data = fetcher.data;
    if (!data) return;

    setEntries((previous) => {
      const seen = new Set(previous.map((entry) => entry.id));
      return [
        ...previous,
        ...data.entries.filter((entry) => !seen.has(entry.id)),
      ];
    });
    setPagination(data.pagination);
  }, [fetcher.data, filtersKey]);

  const isLoadingEntries =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;
  const isLoadingMore = fetcher.state !== "idle";

  const loadMore = useCallback(() => {
    if (isLoadingMore || !pagination.hasMore || !pagination.nextCursor) return;

    const next = new URLSearchParams(searchParams);
    next.set("cursor", pagination.nextCursor);
    pendingFiltersKeyRef.current = filtersKey;
    fetcher.load(`${location.pathname}?${next.toString()}`);
  }, [
    fetcher,
    filtersKey,
    isLoadingMore,
    location.pathname,
    pagination.hasMore,
    pagination.nextCursor,
    searchParams,
  ]);

  return (
    <div className="relative flex h-full flex-col bg-[#f8fafc] dark:bg-slate-950">
      <div className="flex-1 overflow-auto p-6 lg:px-10 lg:py-8">
        <div className="max-w-full">
          <AdminAuditLogHeader />

          <section
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            aria-busy={isLoadingEntries}
          >
            <AdminAuditLogToolbar members={members} filters={filters} />

            {isLoadingEntries ? (
              <AdminAuditLogTableSkeleton rows={8} />
            ) : entries.length > 0 ? (
              <AdminAuditLogTable entries={entries} />
            ) : (
              <AdminAuditLogEmptyState />
            )}
          </section>

          <InfiniteScrollTrigger
            hasMore={pagination.hasMore}
            isLoading={isLoadingMore}
            onTrigger={loadMore}
          />
        </div>
      </div>
    </div>
  );
}
