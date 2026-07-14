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
import { ReportsTable } from "../reports-table";
import { ReportsTableSkeleton } from "../reports-table-skeleton";
import { ReportDrawer } from "../report-drawer";
import type { contentModeratorLoader } from "../../services/content-moderator.loader";
import type { ContentModeratorReport } from "~/types/api-client";
import type { CategoryOption } from "../../types";

export default function ContentModeratorPage() {
  const { content, types } = useLoaderData<typeof contentModeratorLoader>();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const isFiltering =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/tk-admin/content-moderator";

  const selectedTypeId = searchParams.get("typeId") || null;
  const selectedStatus = searchParams.get("status") || "all";

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
    (id: string, resolveAction: "dismiss" | "hide") => {
      fetcher.submit(
        {
          reportUuid: id,
          status: resolveAction === "dismiss" ? "SAFE" : "HIDE",
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

  const handleCategoryChange = useCallback(
    (typeId: string | null) => {
      const next = new URLSearchParams(searchParams);
      if (typeId === null) {
        next.delete("typeId");
      } else {
        next.set("typeId", typeId);
      }
      setSearchParams(next, { preventScrollReset: true, replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleStatusChange = useCallback(
    (status: string) => {
      const next = new URLSearchParams(searchParams);
      if (status === "all") {
        next.delete("status");
      } else {
        next.set("status", status);
      }
      setSearchParams(next, { preventScrollReset: true, replace: true });
    },
    [searchParams, setSearchParams],
  );

  return (
    <div className="relative flex h-full flex-col bg-[#f8fafc] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-350 space-y-4">
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
          <div>
            <FilterBar
              categoryOptions={categoryOptions}
              selectedTypeId={selectedTypeId}
              onCategoryChange={handleCategoryChange}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
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
                  <ReportsTable reports={content} onSelect={handleSelect} />
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
