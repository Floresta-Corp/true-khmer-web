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
        className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-sm"
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
        className="fixed top-0 right-0 bottom-0 z-70 flex w-full max-w-md flex-col border-l border-slate-100 bg-white dark:border-slate-800 dark:bg-[#020617]"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-(--admin-border) p-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-xl p-2.5 transition-all hover:bg-(--admin-card-muted)"
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
              <p className="text-[11px] font-semibold tracking-widest text-(--admin-text-secondary) uppercase">
                REP-{String(report.reportId).padStart(3, "0")}
              </p>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-6 overflow-auto p-6 dark:bg-[#020617]">
          {/* -------- Violation Card -------- */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-rose-600/20 text-rose-500 dark:border-rose-900 dark:bg-rose-950">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="pt-1 text-base font-semibold tracking-tight text-(--admin-text)">
                  {report.type.name}
                </h3>
              </div>

              <div className="rounded-xl border border-(--admin-border) p-5 text-sm leading-relaxed font-medium text-slate-500 italic dark:bg-slate-950 dark:text-slate-300">
                "{report.contentPreview}"
              </div>
              {report.sourceLink &&
              report.confirmStatus !== "CONTENT HIDDEN" ? (
                <Button
                  variant="link"
                  className="h-auto p-0 text-[10px] font-semibold tracking-widest text-blue-600 uppercase hover:underline dark:text-blue-400"
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
            <div className="flex items-center gap-3 border-t border-slate-100 p-6 dark:border-slate-800">
              <Avatar className="h-8 w-8 shrink-0 border border-slate-200 dark:border-slate-700">
                <AvatarImage
                  src={resolveImageURL(report.reportingBy?.avatarKey)}
                  alt={report.reportingBy?.name}
                />
                <AvatarFallback className="bg-slate-100 text-xs font-black text-slate-400 dark:bg-slate-800">
                  {report.reportingBy?.name?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-(--admin-text)">
                  {report.reportingBy?.name}
                </div>
                <div className="text-[11px] font-medium text-(--admin-text-secondary)">
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
                className="group cursor-pointer rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-6 text-center transition-all hover:border-emerald-500/30 hover:bg-emerald-800/20 dark:hover:bg-emerald-900/20"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 transition-transform group-hover:scale-110 dark:bg-emerald-950">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="mb-1 text-sm font-semibold tracking-tight text-(--admin-text) uppercase">
                  Safe
                </h4>
                <p className="text-[12px] leading-tight font-medium text-(--admin-text-secondary)">
                  Keep content visible
                </p>
              </button>

              {/* Hide */}
              <button
                onClick={() => onConfirmChange("hide")}
                className="group cursor-pointer rounded-2xl border border-(--admin-border) bg-(--admin-card-bg) p-6 text-center transition-all hover:border-rose-500/30 hover:bg-rose-800/20 dark:hover:bg-rose-900/20"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-500 transition-transform group-hover:scale-110 dark:bg-rose-950">
                  <EyeOff size={20} />
                </div>
                <h4 className="mb-1 text-sm font-semibold tracking-tight text-(--admin-text) uppercase">
                  Hide
                </h4>
                <p className="text-[12px] leading-tight font-medium text-(--admin-text-secondary)">
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
