import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { cn, resolveImageURL } from "~/lib/utils";
import type {
  Applicant,
  ApplicantStatusAction,
  PostingType,
  PostSourceType,
} from "~/services/manage-post/types";
import ApplicantNoteAction from "./applicant-note-action";
import ApplicantStatusChangeButton from "./applicant-change-status-button";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import ApplicantRolesSelection from "./applicant-roles-selection";

const STATUS_STYLES: Record<ApplicantStatusAction, string> = {
  approve: "bg-green-100 text-green-700 border-green-200 ",
  new: "bg-blue-100 text-blue-700 border-blue-200 ",
  completed: "bg-green-100 text-green-700 border-green-200 ",
  confirmed: "bg-green-100 text-green-700 border-green-200 ",
  decline: "bg-red-100 text-red-700 border-red-200 ",
  under_review: "bg-purple-100 text-purple-700 border-purple-200 ",
  submitted: "bg-amber-100 text-amber-700 border-amber-200 ",
};

const STATUS_LABELS: Record<ApplicantStatusAction, string> = {
  approve: "Approved",
  completed: "Completed",
  new: "New",
  confirmed: "Confirmed",
  decline: "Declined",
  submitted: "Submitted",
  under_review: "Under Review",
};

type Props = {
  applicant: Applicant | null;
  postingId: string;
  sourceType: PostingType;
  onApplicantNoteSaved?: (candidateId: string, note: string) => void;
  onApplicantDeclined?: (
    candidateId: string,
    options: { blocked: boolean },
  ) => void;
  onClose: () => void;
  candidateId: string;
};
export default function ApplicantSideBar({
  applicant,
  onClose,
  onApplicantDeclined,
  onApplicantNoteSaved,
  postingId,
  sourceType,
  candidateId,
}: Props) {
  const normalizeStatus = (status: string): ApplicantStatusAction => {
    const map: Record<string, ApplicantStatusAction> = {
      SUBMITTED: "new",
      UNDER_REVIEW: "under_review",
      APPROVED: "approve",
      CONFIRMED: "confirmed",
      COMPLETED: "completed",
      NEW: "new",
      DECLINED: "decline",
      WITHDRAWN: "decline",
    };
    return map[status?.toUpperCase()] ?? "new";
  };

  const overallStatus = normalizeStatus(applicant?.overallStatus ?? "new");
  const normalizedSourceType = sourceType.toLowerCase();

  const isNew = overallStatus === "new";

  const noteFetcher = useFetcher<string | null>();
  useEffect(() => {
    if (!applicant?.candidate?.id) return;
    noteFetcher.load(
      `/api/candidate-note?sourceType=${normalizedSourceType}&postingId=${postingId}&candidateId=${candidateId}`,
    );
  }, [applicant?.candidate?.id, candidateId, postingId, normalizedSourceType]);

  const existingNote = noteFetcher.data ?? applicant?.privateNote?.note ?? "";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: applicant ? 1 : 0 }}
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-all",
          applicant ? "pointer-events-auto" : "pointer-events-none",
        )}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: applicant ? 0 : "100%" }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="fixed top-0 right-0 h-full w-95 bg-white shadow-2xl z-50 flex pb-5 flex-col overflow-y-auto"
      >
        {applicant && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-gray-100">
                  <AvatarImage
                    src={resolveImageURL(applicant.candidate.avatarKey)}
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
                  {isNew ? (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-gray-100 text-xs mt-1">
                      NEW
                    </Badge>
                  ) : (
                    <Badge
                      className={cn(
                        "text-xs font-semibold border mt-1 pointer-events-none",
                        STATUS_STYLES[overallStatus],
                      )}
                    >
                      {STATUS_LABELS[overallStatus]}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="flex flex-col gap-4  px-6 py-4">
              <div className="flex items-center justify-around rounded-xl border border-gray-100 bg-white p-2">
                {/* Submissions Stat */}
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="flex h-8 items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {applicant?.submissionCount ?? "0"}
                    </span>
                  </div>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    Submissions
                  </span>
                </div>

                <div className="h-10 w-px bg-gray-100" />

                {/* Roles Applied Stat */}
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="flex h-8 items-center justify-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {applicant?.totalRoleApplied ?? "0"}
                    </span>
                  </div>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    Roles Applied
                  </span>
                </div>

                <div className="h-10 w-px bg-gray-100" />

                {/* Overall Status Stat */}
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="flex h-8 items-center justify-center">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        STATUS_STYLES[overallStatus]
                          ?.split(" ")
                          .filter((c) => c.includes("text-"))
                          .join(" "),
                      )}
                    >
                      {STATUS_LABELS[overallStatus]}
                    </span>
                  </div>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    Overall Status
                  </span>
                </div>
              </div>

              <ApplicantRolesSelection
                applicant={applicant}
                sourceType={sourceType}
              />

              {/* Private Note */}
              <ApplicantNoteAction
                sourceType={normalizedSourceType as PostSourceType}
                postingId={postingId}
                candidateId={applicant.candidate.id}
                existingNote={existingNote}
                onSaved={(note) =>
                  onApplicantNoteSaved?.(applicant.candidate.id, note)
                }
              />
            </div>

            {/* Accept / Decline */}
            <ApplicantStatusChangeButton
              applicant={applicant}
              currentStatus={overallStatus as ApplicantStatusAction}
              applicationId={
                applicant.submissions?.[0]?.roles?.[0]?.applicationId ?? ""
              }
              postingId={postingId}
              sourceType={sourceType}
              onDeclined={onApplicantDeclined}
            />
          </>
        )}
      </motion.div>
    </>
  );
}
