import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Report } from "~/features/admin/contentmoderator/types";
import { MOCK_REPORTS } from "~/features/admin/contentmoderator/types";
import { FilterBar } from "~/features/admin/contentmoderator/components/filter-bar";
import { ReportsTable } from "~/features/admin/contentmoderator/components/reports-table";
import { ReportDrawer } from "~/features/admin/contentmoderator/components/report-drawer";

// ── meta ───────────────────────────────────────────────────────────────────
export function meta() {
  return [{ title: "Content Moderator | True Khmer" }];
}

// ── ContentModeratorPage ───────────────────────────────────────────────────
// Main page for reviewing and managing community reports.

export default function ContentModeratorPage() {
  // ── local state ────────────────────────────────────────────────────────
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Types");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [confirmAction, setConfirmAction] = useState<"dismiss" | "hide" | null>(
    null,
  );

  // ── handlers ─────────────────────────────────────────────────────────────
  const handleResolve = useCallback(
    (id: string, action: "dismiss" | "hide") => {
      const result = action === "dismiss" ? "Dismissed" : "Content Hidden";

      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "closed" as const,
                result,
              }
            : r,
        ),
      );

      setConfirmAction(null);

      setSelectedReport((prev) =>
        prev
          ? {
              ...prev,
              status: "closed" as const,
              result,
            }
          : null,
      );
    },
    [],
  );

  const handleSelect = useCallback((report: Report) => {
    setSelectedReport(report);
    setConfirmAction(null);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedReport(null);
    setConfirmAction(null);
  }, []);

  // ── filtered data ──────────────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    return [...reports]
      .filter((r) => {
        const categoryMatch =
          selectedCategory === "All Types" || r.category === selectedCategory;
        const statusMatch =
          selectedStatus === "All" || r.status === selectedStatus;
        return categoryMatch && statusMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [reports, selectedCategory, selectedStatus]);

  // ── render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-slate-950 relative">
      <div className="flex-1 p-6 overflow-auto custom-scrollbar">
        <div className="max-w-350 mx-auto space-y-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Content Moderation
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                Streamlined moderation control for community integrity.
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />

              <div className="flex-1 overflow-auto min-h-0">
                <ReportsTable
                  reports={filteredReports}
                  onSelect={handleSelect}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Report Drawer ───────────────────────────────────────────────── */}
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
