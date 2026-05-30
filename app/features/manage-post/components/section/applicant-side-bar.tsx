import { X, Download, DownloadIcon, Check } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, type ReactNode, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { formatDate } from "~/features/events/lib/event-formatters";
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

const STATUS_STYLES: Record<ApplicantStatusAction, string> = {
  approve: "bg-green-100 text-green-700 border-green-200 hover:bg-gray-100",
  new: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-gray-100",
  completed: "bg-green-100 text-green-700 border-green-200 hover:bg-gray-100",
  confirmed: "bg-green-100 text-green-700 border-green-200 hover:bg-gray-100",
  decline: "bg-red-100 text-red-700 border-red-200 hover:bg-gray-100",
  under_review:
    "bg-purple-100 text-purple-700 border-purple-200 hover:bg-gray-100",
  submitted: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-gray-100",
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
  onClose: () => void;
  candidateId: string;
};

type ApplicantInfoItem = {
  title: string;
  value?: string;
  valueClass?: string;
  hide: boolean;
  link?: ReactNode;
};

export default function ApplicantSideBar({
  applicant,
  onClose,
  onApplicantNoteSaved,
  postingId,
  sourceType,
  candidateId,
}: Props) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const supportingDocs = applicant?.submissions?.[0]?.volunteer
    ?.supportingDocuments as { key: string; name: string }[] | undefined;

  const documentData = supportingDocs?.map((doc, index) => {
    const docKey = typeof doc === "object" ? doc.key : doc;
    const docName = typeof doc === "object" ? doc.name : doc;

    const fallbackName = docKey?.split("/").pop();

    return {
      id: `file-${index}`,
      key: docKey,
      name: docName || fallbackName || `Document ${index + 1}`,
      sizeLabel: "PDF",
    };
  });

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

  const roles = applicant?.submissions?.[0]?.roles ?? [];
  const hasMultipleRoles = roles.length > 1;
  const isRoleTopPick = (role?: (typeof roles)[number]) => {
    if (!role || !applicant?.submissions[0]?.topPick) return false;
    return Boolean(
      [role.roleId, role.applicationId].find(
        (id) => id === applicant.submissions[0].topPick,
      ),
    );
  };
  const overallStatus = normalizeStatus(applicant?.overallStatus ?? "new");
  const normalizedSourceType = sourceType.toLowerCase();
  const isVolunteerPosting = normalizedSourceType === "volunteer";

  const isNew = overallStatus === "new";

  // console.log("Sidebar reading note:", applicant?.privateNote);

  const volunteerInfo: ApplicantInfoItem[] = [
    {
      title: "Applied On",
      value: formatDate(applicant?.submissions?.[0]?.appliedAt || ""),
      hide: false,
    },
    {
      title: "Availability",
      value: applicant?.submissions?.[0]?.volunteer?.availability,
      hide: false,
    },
    {
      title: "Relevant Experience",
      value: applicant?.submissions?.[0]?.volunteer?.relevantExperience,
      valueClass: "text-gray-600 leading-relaxed",
      hide: !applicant?.submissions?.[0]?.volunteer?.relevantExperience,
    },
  ];

  const projectInfo: ApplicantInfoItem[] = [
    {
      title: "Applied On",
      value: formatDate(applicant?.submissions?.[0]?.appliedAt || ""),
      hide: false,
    },
    {
      title: "Why do you want to join this project?",
      value: applicant?.submissions?.[0]?.project?.motivation,
      hide: !applicant?.submissions?.[0]?.project?.motivation,
    },
    {
      title: "Portfolio",
      value: applicant?.submissions?.[0]?.project?.portfolio,
      valueClass: "text-gray-600 leading-relaxed",
      hide: !applicant?.submissions?.[0]?.project?.portfolio,
      link: (
        <a
          href={applicant?.submissions?.[0]?.project?.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {applicant?.submissions?.[0]?.project?.portfolio}
        </a>
      ),
    },
  ];

  const noteFetcher = useFetcher<string | null>();
  useEffect(() => {
    if (!applicant?.candidate?.id) return;
    noteFetcher.load(
      `/api/candidate-note?sourceType=${normalizedSourceType}&postingId=${postingId}&candidateId=${candidateId}`,
    );
  }, [applicant?.candidate?.id, candidateId, postingId, normalizedSourceType]);

  const existingNote = noteFetcher.data ?? applicant?.privateNote?.note ?? "";

  const applicantInfo = isVolunteerPosting ? volunteerInfo : projectInfo;

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
                  {isNew ? (
                    <Badge className="bg-blue-500 text-white border-0 hover:bg-blue-600 text-xs mt-1">
                      NEW
                    </Badge>
                  ) : (
                    <Badge
                      className={cn(
                        "text-xs font-semibold border mt-1",
                        STATUS_STYLES[overallStatus],
                      )}
                    >
                      {STATUS_LABELS[overallStatus]}
                    </Badge>
                  )}
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

            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-around rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                {/* Submissions Stat */}
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {applicant?.submissionCount ?? "0"}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    Submissions
                  </span>
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-gray-100" />

                {/* Roles Applied Stat */}
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {applicant?.totalRoleApplied ?? "0"}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    Roles Applied
                  </span>
                </div>

                {/* Divider */}
                <div className="h-10 w-px bg-gray-100" />

                {/* Overall Status Stat */}
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <span className="text-xs font-semibold ">
                    {STATUS_LABELS[overallStatus]}
                  </span>
                  <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    Overall Status
                  </span>
                </div>
              </div>

              {/* Roles Applied — multi-role & single-role */}
              {hasMultipleRoles ? (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Roles Applied ({roles.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {roles.map((role) => {
                      const isSelected = selectedRoleId === role.roleId;
                      const isTopPick = isRoleTopPick(role);

                      const isApproved = [
                        "APPROVED",
                        "CONFIRMED",
                        "COMPLETED",
                      ].includes(role.status);
                      const isDeclined =
                        role.status === "DECLINED" ||
                        role.status === "WITHDRAWN";
                      const isFinalized = isApproved || isDeclined;

                      return (
                        <button
                          key={role.roleId}
                          type="button"
                          onClick={() =>
                            !isFinalized &&
                            setSelectedRoleId(isSelected ? null : role.roleId)
                          }
                          disabled={isFinalized}
                          className={cn(
                            "flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-left transition-all",
                            isApproved
                              ? "border-green-300 bg-green-50 cursor-default"
                              : isDeclined
                                ? "border-gray-200 bg-gray-50 opacity-50 cursor-default"
                                : isSelected
                                  ? "border-blue-300 bg-blue-50"
                                  : "border-gray-200 bg-white hover:bg-gray-50",
                          )}
                        >
                          {/*  status indicator */}
                          <div
                            className={cn(
                              "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                              isApproved
                                ? "border-green-500 bg-green-500"
                                : isDeclined
                                  ? "border-gray-300 bg-gray-300"
                                  : isSelected
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300 bg-white",
                            )}
                          >
                            {isApproved && (
                              <Check
                                className="w-3 h-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                            {isDeclined && (
                              <X
                                className="w-3 h-3 text-white"
                                strokeWidth={3}
                              />
                            )}
                            {!isFinalized && isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "text-sm font-semibold truncate",
                                  isApproved
                                    ? "text-green-700"
                                    : isDeclined
                                      ? "text-gray-400"
                                      : "text-gray-900",
                                )}
                              >
                                {role.title}
                              </span>
                              {isTopPick && (
                                <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                                  Top Pick
                                </span>
                              )}
                              {isApproved && (
                                <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200">
                                  {role.status === "CONFIRMED"
                                    ? "Confirmed"
                                    : role.status === "COMPLETED"
                                      ? "Completed"
                                      : "Approved"}
                                </span>
                              )}
                              {isDeclined && (
                                <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                                  Declined
                                </span>
                              )}
                            </div>
                            {role.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {role.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Only show info note if not yet finalized */}
                  {!roles.some((r) =>
                    ["APPROVED", "CONFIRMED", "COMPLETED"].includes(r.status),
                  ) && (
                    <div className="mt-3 flex gap-2 rounded-xl bg-gray-50 border border-gray-200 p-3">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-[11px] font-bold flex items-center justify-center">
                        i
                      </span>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Note: You can only approve one role for this candidate.
                        Once a role is approved, all other applications from
                        this candidate will be automatically declined.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Role Applied
                  </p>

                  {roles.map((role) => {
                    const isTopPick = isRoleTopPick(role);
                    const isApproved = [
                      "APPROVED",
                      "CONFIRMED",
                      "COMPLETED",
                    ].includes(role.status);
                    const isDeclined =
                      role.status === "DECLINED" || role.status === "WITHDRAWN";

                    return (
                      <div
                        key={role.roleId}
                        className={cn(
                          "flex items-center gap-3 w-full rounded-xl border px-4 py-3 text-left transition-all",
                          isApproved
                            ? "border-green-300 bg-green-50"
                            : isDeclined
                              ? "border-gray-200 bg-gray-50 opacity-50"
                              : "border-gray-200 bg-white",
                        )}
                      >
                        <div
                          className={cn(
                            "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            isApproved
                              ? "border-green-500 bg-green-500"
                              : isDeclined
                                ? "border-gray-300 bg-gray-300"
                                : "border-gray-300 bg-white",
                          )}
                        >
                          {isApproved && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                          {isDeclined && (
                            <X className="w-3 h-3 text-white" strokeWidth={3} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-semibold truncate",
                                isApproved
                                  ? "text-green-700"
                                  : isDeclined
                                    ? "text-gray-400"
                                    : "text-gray-900",
                              )}
                            >
                              {role.title}
                            </span>
                            {isTopPick && (
                              <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                                Top Pick
                              </span>
                            )}
                            {isApproved && (
                              <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200">
                                {role.status === "CONFIRMED"
                                  ? "Confirmed"
                                  : role.status === "COMPLETED"
                                    ? "Completed"
                                    : "Approved"}
                              </span>
                            )}
                            {isDeclined && (
                              <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                                Declined
                              </span>
                            )}
                          </div>
                          {role.description && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">
                              {role.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {applicantInfo.map((info, idx) => (
                <Fragment key={idx}>
                  {info.hide ? null : (
                    <div className="bg-gray-50 p-4 rounded-2xl ">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                        {info.title}
                      </p>
                      <p
                        className={cn("text-sm text-gray-700", info.valueClass)}
                      >
                        {info.link ?? info.value}
                      </p>
                    </div>
                  )}
                </Fragment>
              ))}
              {/* Supporting Documents */}
              {documentData?.map((file) => (
                <a
                  key={file.id}
                  href={resolveImageURL(file.key)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-[#E7ECF3] p-3 transition-all hover:bg-slate-50"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white">
                    <Download size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="line-clamp-1 text-sm font-medium text-[#0F1729]">
                      {file?.name}
                    </div>
                    <div className="text-xs font-semibold text-[#99A1AF]">
                      {file.sizeLabel}
                    </div>
                  </div>
                  <DownloadIcon className="text-[#D1D5DC]" size={16} />
                </a>
              ))}

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
              selectedRoleId={hasMultipleRoles ? selectedRoleId : undefined}
            />
          </>
        )}
      </motion.div>
    </>
  );
}
