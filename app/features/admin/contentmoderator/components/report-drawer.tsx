import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  EyeOff,
} from "lucide-react";
import { StatusBadge } from "./status-badge";
import { ConfirmationModal } from "./confirmation-modal";
import { PostPreviewPanel } from "./post-preview-panel";
import type { ContentModeratorReport } from "~/types/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { Button } from "~/components/ui/button";
import { ResolutionLog } from "./resolutionBy";
import { resolveImageURL } from "~/lib/utils";

interface ReportDrawerProps {
  report: ContentModeratorReport | null;
  confirmAction: "dismiss" | "hide" | null;
  onClose: () => void;
  onResolve: (id: string, action: "dismiss" | "hide") => void;
  onConfirmChange: (action: "dismiss" | "hide" | null) => void;
}

export function ReportDrawer({
  report,
  confirmAction,
  onClose,
  onResolve,
  onConfirmChange,
}: ReportDrawerProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Reset the preview whenever the drawer switches to a different report.
  useEffect(() => {
    setPreviewOpen(false);
  }, [report?.id]);

  if (!report) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-60"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={drawerVariants}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#020617] z-70 flex flex-col border-l border-slate-100 dark:border-slate-800"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-8 border-b border-(--admin-border)">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-(--admin-card-muted) rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft
                size={22}
                className="text-(--admin-text-secondary)"
              />
            </button>
            <div>
              <h2 className="text-xl font-semibold tracking-tighter text-(--admin-text)">
                Review Report
              </h2>
              <p className="text-[11px] font-semibold text-(--admin-text-secondary) uppercase tracking-widest">
                REP-{String(report.reportId).padStart(3, "0")}
              </p>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto p-6 space-y-6 dark:bg-[#020617]">
          {/* -------- Violation Card -------- */}
          <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-600/20 dark:bg-rose-950 flex items-center justify-center text-rose-500 border dark:border-rose-900 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-base font-semibold text-(--admin-text) tracking-tight pt-1">
                  {report.type.name}
                </h3>
              </div>

              <div className="dark:bg-slate-950 rounded-xl p-5 border border-(--admin-border) italic text-slate-500  dark:text-slate-300 leading-relaxed font-medium text-sm">
                "{report.contentPreview}"
              </div>
              {report.sourceLink &&
              report.confirmStatus !== "CONTENT HIDDEN" ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-blue-600 dark:text-blue-400 font-semibold text-[10px] uppercase tracking-widest hover:underline"
                  onClick={() => setPreviewOpen(true)}
                >
                  <span className="inline-flex items-center gap-1.5 leading-none">
                    <ExternalLink size={12} className="shrink-0" />
                    <span>View Original Post</span>
                  </span>
                </Button>
              ) : null}
            </div>

            {/* Reporter info */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Avatar className="shrink-0 w-8 h-8 border border-slate-200 dark:border-slate-700">
                <AvatarImage
                  src={resolveImageURL(report.reportingBy?.avatarKey)}
                  alt={report.reportingBy?.name}
                />
                <AvatarFallback className="text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-400">
                  {report.reportingBy?.name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-(--admin-text) truncate">
                  {report.reportingBy?.name}
                </div>
                <div className="text-[11px] text-(--admin-text-secondary) font-medium">
                  {formatMinutesOrHoursAgo(report.dateTime)}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Resolution Log (if closed) -------- */}
          {report.status === "CLOSED" && <ResolutionLog report={report} />}

          {/* -------- Action Grid (if open) -------- */}
          {report.status !== "CLOSED" && (
            <div className="grid grid-cols-2 gap-3">
              {/* Safe (Dismiss) */}
              <button
                onClick={() => onConfirmChange("dismiss")}
                className="bg-(--admin-card-bg) p-6 rounded-2xl border border-(--admin-border) hover:border-emerald-500/30 hover:bg-emerald-800/20 dark:hover:bg-emerald-900/20 transition-all text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 dark:bg-emerald-950 mx-auto mb-3 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-sm font-semibold text-(--admin-text) mb-1 uppercase tracking-tight">
                  Safe
                </h4>
                <p className="text-[12px] text-(--admin-text-secondary) font-medium leading-tight">
                  Keep content visible
                </p>
              </button>

              {/* Hide */}
              <button
                onClick={() => onConfirmChange("hide")}
                className="bg-(--admin-card-bg) p-6 rounded-2xl border border-(--admin-border) hover:border-rose-500/30 hover:bg-rose-800/20 dark:hover:bg-rose-900/20 transition-all text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/20 dark:bg-rose-950 mx-auto mb-3 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <EyeOff size={20} />
                </div>
                <h4 className="text-sm font-semibold text-(--admin-text) mb-1 uppercase tracking-tight">
                  Hide
                </h4>
                <p className="text-[12px] text-(--admin-text-secondary) font-medium leading-tight">
                  Remove from feed
                </p>
              </button>
            </div>
          )}
        </div>

        {/* ── Confirmation Modal ──────────────────────────────────────────── */}
        <AnimatePresence>
          {confirmAction && (
            <ConfirmationModal
              action={confirmAction}
              onConfirm={() => onResolve(report.id, confirmAction)}
              onCancel={() => onConfirmChange(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/*  Original Post Preview */}
      {report.sourceLink && (
        <PostPreviewPanel
          open={previewOpen}
          sourceLink={report.sourceLink}
          onOpenChange={setPreviewOpen}
        />
      )}
    </>
  );
}
