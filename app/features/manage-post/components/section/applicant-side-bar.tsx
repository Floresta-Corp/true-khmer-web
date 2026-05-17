import { X, FileText, Download, Mail, Phone } from "lucide-react";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/features/events/lib/event-formatters";
import { cn } from "~/lib/utils";
import type {
  Applicant,
  ApplicantStatusAction,
  ApplicationStatus,
  PostingType,
} from "~/services/manage-post/types";
import ApplicantStatusChangeButton from "./applicant-change-status-button";

const STATUS_STYLES: Record<ApplicantStatusAction, string> = {
  approve: "bg-green-100 text-green-700 border-green-200 hover:bg-gray-100",
  decline: "bg-red-100 text-red-700 border-red-200 hover:bg-gray-100",
  under_review:
    "bg-purple-100 text-purple-700 border-purple-200 hover:bg-gray-100",
  submitted: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-gray-100",
};

const STATUS_LABELS: Record<ApplicantStatusAction, string> = {
  approve: "Approved",
  decline: "Declined",
  submitted: "Submitted",
  under_review: "Under Review",
};

type Props = {
  applicant: Applicant | null;
  postingId: string;
  sourceType: PostingType;
  onClose: () => void;
};

export default function ApplicantSideBar({
  applicant,
  onClose,
  postingId,
  sourceType,
}: Props) {
  const normalizeStatus = (status: string): ApplicantStatusAction => {
    const map: Record<string, ApplicantStatusAction> = {
      SUBMITTED: "submitted",
      UNDER_REVIEW: "under_review",
      APPROVED: "approve",
      CONFIRMED: "approve",
      COMPLETED: "approve",
      DECLINED: "decline",
      WITHDRAWN: "decline",
    };
    return map[status?.toUpperCase()] ?? "submitted";
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: applicant ? 1 : 0 }}
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/20 z-40 transition-all",
          applicant ? "pointer-events-auto" : "pointer-events-none",
        )}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: applicant ? 0 : "100%" }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-95 bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
      >
        {applicant && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-gray-100">
                  <AvatarImage
                    src={applicant.candidate.avatarUrl || ""}
                    alt={applicant.candidate.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm font-semibold bg-gray-100 text-gray-600">
                    {applicant.candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {applicant.candidate.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {applicant.candidate.email}
                  </p>
                  <Badge
                    className={cn(
                      "text-xs font-semibold border mt-1",
                      STATUS_STYLES[normalizeStatus(applicant.status)],
                    )}
                  >
                    {STATUS_LABELS[normalizeStatus(applicant.status)]}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100">
              <a
                href={`mailto:${applicant.candidate.email}`}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-500 transition-colors text-xs font-medium"
              >
                <Mail size={16} />
                Email
              </a>

              <a
                href={
                  applicant.candidate.telegramUsername
                    ? `https://t.me/${applicant.candidate.telegramUsername.replace("@", "")}`
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 text-xs font-medium transition-colors",
                  applicant.candidate.telegramUsername
                    ? "hover:bg-blue-50 hover:text-blue-600 text-gray-500"
                    : "opacity-40 cursor-not-allowed text-gray-400 pointer-events-none",
                )}
              >
                <Send size={16} />
                Telegram
              </a>

              <a
                href={
                  applicant.candidate.phoneNumber
                    ? `tel:${applicant.candidate.phoneNumber}`
                    : undefined
                }
                className={cn(
                  "flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 text-xs font-medium transition-colors",
                  applicant.candidate.phoneNumber
                    ? "hover:bg-blue-50 hover:text-blue-600 text-gray-500"
                    : "opacity-40 cursor-not-allowed text-gray-400 pointer-events-none",
                )}
              >
                <Phone size={16} />
                Phone
              </a>
            </div>

            <div className="flex flex-col gap-6 p-6">
              {/* Role Applied */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  Role Applied
                </p>
                <Badge className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-50 text-sm">
                  {applicant.role.title}
                </Badge>
              </div>

              {/* Applied On */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  Applied On
                </p>
                <p className="text-sm text-gray-700">
                  {formatDate(applicant.appliedAt)}
                </p>
              </div>

              {/* Relevant Experience (volunteer) */}
              {applicant.volunteer?.relevantExperience && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Relevant Experience
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {applicant.volunteer.relevantExperience}
                  </p>
                </div>
              )}

              {/* Motivation (project) */}
              {applicant.project?.motivation && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Motivation
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {applicant.project.motivation}
                  </p>
                </div>
              )}

              {/* Supporting Documents */}
              {applicant.volunteer?.supportingDocuments?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Attached Files
                  </p>
                  <div className="flex flex-col gap-2">
                    {applicant.volunteer.supportingDocuments.map((doc) => (
                      <div
                        key={doc.key}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50"
                      >
                        <a
                          href={doc?.key}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <FileText size={14} className="text-blue-400" />
                          {doc.name}
                        </a>
                        <a
                          href={doc.key}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={doc.name}
                          aria-label={`Download ${doc.name}`}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Accept / Decline */}
            <ApplicantStatusChangeButton
              applicant={applicant}
              currentStatus={
                normalizeStatus(applicant.status) as ApplicationStatus
              }
              applicationId={applicant.id}
              postingId={postingId}
              sourceType={sourceType}
            />
          </>
        )}
      </motion.div>
    </>
  );
}
