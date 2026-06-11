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
    <div className="bg-(--admin-page-bg) h-full flex flex-col overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="px-10 py-10 pt-16 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-5xl font-black text-(--admin-text) tracking-tighter mb-3">
              Content <span className="text-blue-600 dark:text-blue-400">Moderation</span>
            </h1>
            <p className="text-base text-(--admin-text-secondary) font-medium max-w-md">
              Streamlined moderation control for community integrity.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="flex-1 px-10 pt-0 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col gap-6"
            >
              {/* Filter Bar */}
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />

              {/* Reports Table */}
              <div className="flex-1 overflow-auto min-h-0">
                <ReportsTable
                  reports={filteredReports}
                  onSelect={handleSelect}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

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
