import { useCallback, useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  useSearchParams,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router";
import { FilterBar } from "../components/filter-bar";
import { ReportsTable } from "../components/reports-table";
import { ReportsTableSkeleton } from "../components/reports-table-skeleton";
import { ReportDrawer } from "../components/report-drawer";
import type { contentModeratorLoader } from "~/features/admin/contentmoderator/service/content-moderator.loder";
import type { ContentModeratorReport } from "~/types/api-client";

export type CategoryOption = { id: string | null; name: string };

export default function ContentModeratingPage() {
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
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data as {
        success?: boolean;
        report?: ContentModeratorReport;
        error?: string;
      };

      if (data.success && data.report) {
        setSelectedReport(null);
        setConfirmAction(null);
      } else if (data.error) {
        console.error("Action failed:", data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleResolve = (id: string, action: "dismiss" | "hide") => {
    fetcher.submit(
      {
        reportUuid: id,
        status: action === "dismiss" ? "SAFE" : "HIDE",
      },
      { method: "POST", action: "/tk-admin/content-moderator" },
    );
  };

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
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 relative">
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        <div className="max-w-350 mx-auto space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Content <span className="text-blue-600">Moderation</span>
              </h1>
              <p className="text-slate-500 font-medium text-base mt-1">
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
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col relative"
            >
              <div className="flex-1 overflow-auto min-h-0">
                {isFiltering ? (
                  <ReportsTableSkeleton />
                ) : (
                  <ReportsTable
                    reports={[...content]}
                    onSelect={handleSelect}
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
