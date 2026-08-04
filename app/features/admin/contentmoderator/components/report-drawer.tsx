import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Flag, Clock } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { ConfirmationModal } from "./confirmation-modal";
import { PostPreviewPanel } from "./post-preview-panel";
import { OriginalPostCard } from "./original-post-card";
import { ReportActionButton } from "./report-action-button";
import { ResolutionLog } from "./resolutionBy";
import { ResolutionStatusRow } from "./resolution-status-row";
import type { ContentModeratorReport } from "~/types/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatDateTime } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import { getInitials } from "~/routes/onboarding/domain/profile/profile-utils";

interface ReportDrawerProps {
  report: ContentModeratorReport | null;
  confirmAction: "dismiss" | "hide" | null;
  onClose: () => void;
  onResolve: (id: string, action: "dismiss" | "hide", note?: string) => void;
  onConfirmChange: (action: "dismiss" | "hide" | null) => void;
}

export function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-widest text-(--admin-text-secondary) uppercase">
          {label}
        </p>
        <p className="text-[13px] font-medium text-(--admin-text)">{value}</p>
      </div>
    </div>
  );
}

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

  const contentLabel = report.reportSubType
    ? report.reportSubType.charAt(0) +
      report.reportSubType.slice(1).toLowerCase()
    : "Post";

  const reporterName = report.reportingBy?.name ?? "Unknown";
  const isOpen = report.status !== "CLOSED";

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
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 z-70 flex w-full max-w-md flex-col border-l border-slate-100 bg-white dark:border-slate-800 dark:bg-[#020617]"
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-8 pt-8">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold tracking-wide text-(--admin-text-secondary)">
                RPT-{String(report.reportId).padStart(4, "0")}
              </span>
              <StatusBadge status={report.status} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-(--admin-text)">
              Additional Details
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report details"
            className="shrink-0 cursor-pointer rounded-xl border border-(--admin-border) p-2.5 transition-all hover:bg-(--admin-card-muted)"
          >
            <X size={20} className="text-(--admin-text-secondary)" />
          </button>
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div className="flex-1 space-y-5 overflow-auto px-8 py-2">
          {/* Reporter quote — only when the reporter actually wrote something */}
          {report.reporterNote?.trim() ? (
            <p className="text-base leading-relaxed text-(--admin-text)">
              &ldquo;{report.reporterNote.trim()}&rdquo;
            </p>
          ) : null}

          {/* Metadata rows */}
          <div className="space-y-5">
            <MetaRow
              icon={
                <Flag size={18} className="text-(--admin-text-secondary)" />
              }
              label="Reason"
              value={report.type.name}
            />
            <MetaRow
              icon={
                <Clock size={18} className="text-(--admin-text-secondary)" />
              }
              label="Reported on"
              value={formatDateTime(report.dateTime)}
            />

            {/* Reported by */}
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage
                  src={resolveImageURL(report.reportingBy?.avatarKey)}
                  alt={reporterName}
                />
                <AvatarFallback className="bg-indigo-900 text-[11px] font-bold text-white">
                  {getInitials(reporterName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-(--admin-text-secondary) uppercase">
                  Reported by
                </p>
                <p className="truncate text-[14px] font-medium text-(--admin-text)">
                  {reporterName}
                </p>
              </div>
            </div>
          </div>

          {/* Resolution status summary (resolved reports only) */}
          {!isOpen && (
            <>
              <ResolutionStatusRow report={report} />
              <div className="border-t border-(--admin-border)" />
            </>
          )}

          {/* Reported content, then the action grid or the resolution log */}
          <OriginalPostCard
            report={report}
            contentLabel={contentLabel}
            onPreview={() => setPreviewOpen(true)}
          />
          {isOpen ? (
            <ReportActionButton onAction={onConfirmChange} />
          ) : (
            <ResolutionLog report={report} />
          )}
        </div>

        {/* ── Confirmation Modal ──────────────────────────────────────────── */}
        <ConfirmationModal
          action={confirmAction}
          onConfirm={(note) => {
            if (confirmAction) onResolve(report.id, confirmAction, note);
          }}
          onCancel={() => onConfirmChange(null)}
        />
      </motion.div>

      {/* Original post preview */}
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
