import type { Report } from "~/features/admin/contentmoderator/types";
import { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  EyeOff,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { ConfirmationModal } from "./confirmation-modal";

// ── ReportDrawer ────────────────────────────────────────────────────────────
// Side panel that slides in to show the full report details and actions.

interface ReportDrawerProps {
  report: Report | null;
  confirmAction: "dismiss" | "hide" | null;
  onClose: () => void;
  onResolve: (id: string, action: "dismiss" | "hide") => void;
  onConfirmChange: (action: "dismiss" | "hide" | null) => void;
}

export const ReportDrawer = memo(function ReportDrawer({
  report,
  confirmAction,
  onClose,
  onResolve,
  onConfirmChange,
}: ReportDrawerProps) {
  if (!report) return null;

  // ── Drawer animation variants ───────────────────────────────────────────
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
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0f1422] z-70 flex flex-col border-l border-[#1c2235]"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-8 border-b border-[#1c2235]">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-[#1c2235] rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft size={22} className="text-slate-400" />
            </button>
            <div>
              <h2 className="text-xl font-black tracking-tighter text-white">
                Review Report
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {report.id}
              </p>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto p-6 space-y-6 bg-[#0f1422]">
          {/* -------- Violation Card -------- */}
          <div className="bg-[#131928] rounded-2xl border border-[#1c2235] overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-950 flex items-center justify-center text-rose-500 border border-rose-900 shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <h3 className="text-base font-black text-white tracking-tight pt-1">
                  {report.category}
                </h3>
              </div>

              <div className="bg-[#08090f] rounded-xl p-5 border border-[#1c2235] italic text-slate-300 leading-relaxed font-medium text-xs">
                "{report.target.preview}"
              </div>

              <button className="flex items-center gap-2 text-blue-400 font-black text-[9px] uppercase tracking-widest hover:underline cursor-pointer">
                View Original Post <ExternalLink size={10} className="mb-0.5" />
              </button>
            </div>

            {/* Reporter info */}
            <div className="p-6 border-t border-[#1c2235] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-black text-[10px]">
                {report.reporterAvatar}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-white truncate">
                  {report.reporter}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {format(new Date(report.createdAt), "MMM d, yyyy • h:mm a")}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Resolution Log (if closed) -------- */}
          {report.status === "closed" && <ResolutionLog report={report} />}

          {/* -------- Action Grid (if open) -------- */}
          {report.status !== "closed" && (
            <div className="grid grid-cols-2 gap-3">
              {/* Safe (Dismiss) */}
              <button
                onClick={() => onConfirmChange("dismiss")}
                className="bg-[#0f1422] p-6 rounded-2xl border border-[#1c2235] hover:border-emerald-500/30 hover:bg-emerald-950/20 transition-all text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-950 mx-auto mb-3 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="text-xs font-black text-white mb-1 uppercase tracking-tight">
                  Safe
                </h4>
                <p className="text-[9px] text-slate-400 font-medium leading-tight">
                  Keep content visible
                </p>
              </button>

              {/* Hide */}
              <button
                onClick={() => onConfirmChange("hide")}
                className="bg-[#0f1422] p-6 rounded-2xl border border-[#1c2235] hover:border-rose-500/30 hover:bg-rose-950/20 transition-all text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-rose-950 mx-auto mb-3 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                  <EyeOff size={20} />
                </div>
                <h4 className="text-xs font-black text-white mb-1 uppercase tracking-tight">
                  Hide
                </h4>
                <p className="text-[9px] text-slate-400 font-medium leading-tight">
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
    </>
  );
});

// ── ResolutionLog ─────────────────────────────────────────────────────────
// Shows who resolved the report and when (only for closed reports).

function ResolutionLog({ report }: { report: Report }) {
  return (
    <div className="p-5 bg-emerald-950/30 border border-emerald-800/50 rounded-2xl space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
          Resolved By
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400 font-black text-[10px]">
          SW
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-sm font-bold text-white truncate">
              Sarah Wilson
            </p>
            <span className="px-2 py-0.5 bg-emerald-900/50 text-emerald-400 text-[8px] font-black rounded uppercase tracking-tighter">
              {report.result}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-400 font-medium">
              Platform Moderator
            </p>
            <p className="text-[10px] text-slate-400 font-medium lowercase first-letter:uppercase">
              {format(new Date(), "MMM d, yyyy • h:mm a")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
