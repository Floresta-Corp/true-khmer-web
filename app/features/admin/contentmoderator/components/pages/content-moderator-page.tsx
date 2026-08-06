import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  useSearchParams,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router";
import { toast } from "sonner";
import { FilterBar } from "../filter-bar";
import { ReportStatsCards } from "../report-stats-cards";
import { ReportsTable } from "../reports-table";
import { ReportsTableSkeleton } from "../reports-table-skeleton";
import { ReportDrawer } from "../report-drawer";
import type { contentModeratorLoader } from "../../services/content-moderator.loader";
import type { ContentModeratorReport } from "~/types/api-client";
import type { CategoryOption } from "../../types";

export default function ContentModeratorPage() {
  const { content, types, stats, highlightedReportId } =
    useLoaderData<typeof contentModeratorLoader>();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  useEffect(() => {
    if (!highlightedReportId) return;
    if (!searchParams.has("contentId")) return;
    const next = new URLSearchParams(searchParams);
    next.delete("contentId");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }, [highlightedReportId, searchParams, setSearchParams]);

  const isFiltering =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/tk-admin/content-moderator";

  const selectedTypeId = searchParams.get("typeId") || null;
  const selectedStatus = searchParams.get("status") || "all";
  const searchValue = searchParams.get("search") ?? "";

  const categoryOptions = useMemo<CategoryOption[]>(
    () => [{ id: null, name: "All Types" }, ...types],
    [types],
  );

  const [selectedReport, setSelectedReport] =
    useState<ContentModeratorReport | null>(null);
  const [confirmAction, setConfirmAction] = useState<"dismiss" | "hide" | null>(
    null,
  );

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.success) {
      toast.success("Report updated successfully.");
    } else if (fetcher.data.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  const handleResolve = useCallback(
    (id: string, resolveAction: "dismiss" | "hide", note?: string) => {
      fetcher.submit(
        {
          reportUuid: id,
          status: resolveAction === "dismiss" ? "SAFE" : "HIDE",
          ...(note ? { note } : {}),
        },
        { method: "POST", action: "/tk-admin/content-moderator" },
      );
      setSelectedReport(null);
      setConfirmAction(null);
    },
    [fetcher],
  );

  const handleSelect = useCallback((report: ContentModeratorReport) => {
    setSelectedReport(report);
    setConfirmAction(null);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedReport(null);
    setConfirmAction(null);
  }, []);

  /**
   * Applies a filter change and drops the cursor, since a cursor from the
   * previous result set is meaningless once the filters change.
   */
  const applyFilter = useCallback(
    (key: "typeId" | "status" | "search", value: string | null) => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete("cursor");
      setSearchParams(next, { preventScrollReset: true, replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleCategoryChange = useCallback(
    (typeId: string | null) => applyFilter("typeId", typeId),
    [applyFilter],
  );

  const handleStatusChange = useCallback(
    (status: string) => applyFilter("status", status === "all" ? null : status),
    [applyFilter],
  );

  const handleSearchChange = useCallback(
    (value: string) => applyFilter("search", value.trim() || null),
    [applyFilter],
  );

  return (
    <div className="relative flex h-full flex-col bg-[#f8fafc] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="max-w-full space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                Content Moderation
              </h1>
              <p className="mt-1 text-base font-medium text-slate-500">
                Streamlined moderation control for community integrity.
              </p>
            </div>
          </div>

          <ReportStatsCards stats={stats} />

          <div>
            <FilterBar
              categoryOptions={categoryOptions}
              selectedTypeId={selectedTypeId}
              onCategoryChange={handleCategoryChange}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-h-0 flex-1 overflow-auto">
                {isFiltering ? (
                  <ReportsTableSkeleton />
                ) : (
                  <ReportsTable
                    reports={content}
                    onSelect={handleSelect}
                    highlightedReportId={highlightedReportId}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <ReportDrawer
            report={selectedReport}
            confirmAction={confirmAction}
            onClose={handleCloseDrawer}
            onResolve={handleResolve}
            onConfirmChange={setConfirmAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
