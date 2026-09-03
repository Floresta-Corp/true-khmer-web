import { Download, DownloadIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { formatDateMonthYear } from "~/features/events/lib/event-formatters";
import { cn, resolveImageURL } from "~/lib/utils";
import type {
  Applicant,
  PostingType,
} from "~/features/workspace/manage-post/types";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFetcher } from "react-router";

type ApplicantRolesSelectionProps = {
  applicant: Applicant;
  sourceType: PostingType;
};

const APPROVED_STATUSES = ["APPROVED", "CONFIRMED", "COMPLETED"];
const DECLINED_STATUSES = ["DECLINED", "WITHDRAWN"];
const REVIEWABLE_STATUSES = ["NEW", "SUBMITTED"];

const ROLE_STATUS_LABELS: Record<string, string> = {
  APPROVED: "Approved",
  COMPLETED: "Completed",
  CONFIRMED: "Confirmed",
  DECLINED: "Declined",
  NEW: "New",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "In Review",
  WITHDRAWN: "Withdrawn",
};

const ROLE_STATUS_STYLES: Record<string, string> = {
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  DECLINED: "bg-gray-100 text-gray-500 border-gray-200",
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  SUBMITTED: "bg-amber-50 text-amber-700 border-amber-200",
  UNDER_REVIEW: "bg-purple-50 text-purple-700 border-purple-200",
  WITHDRAWN: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function ApplicantRolesSelection({
  applicant,
  sourceType,
}: ApplicantRolesSelectionProps) {
  const fetcher = useFetcher();
  const normalizedSourceType = sourceType.toLowerCase();
  const defaultSubmissionKey = applicant.submissions[0]?.submissionKey ?? "";
  const [openSubmissionKey, setOpenSubmissionKey] =
    useState(defaultSubmissionKey);
  const reviewedSubmissionKeys = useRef<Set<string>>(new Set());

  const pendingSubmissionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setOpenSubmissionKey(defaultSubmissionKey);
    reviewedSubmissionKeys.current.clear();
    pendingSubmissionKeyRef.current = null;
  }, [applicant.candidate.id, defaultSubmissionKey]);

  useEffect(() => {
    if (!openSubmissionKey) return;

    const submission = applicant.submissions.find(
      (item) => item.submissionKey === openSubmissionKey,
    );
    if (!submission || reviewedSubmissionKeys.current.has(openSubmissionKey)) {
      return;
    }

    const applicationIds = submission.roles
      .filter((role) => REVIEWABLE_STATUSES.includes(role.status))
      .map((role) => role.applicationId)
      .filter(Boolean);

    if (!applicationIds.length) return;

    pendingSubmissionKeyRef.current = openSubmissionKey;
    const formData = new FormData();
    applicationIds.forEach((applicationId) =>
      formData.append("applicationIds", applicationId),
    );
    formData.append("statusAction", "under_review");
    fetcher.submit(formData, { method: "POST" });
  }, [applicant.submissions, fetcher, openSubmissionKey]);

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data &&
      (fetcher.data as any).success !== false
    ) {
      if (pendingSubmissionKeyRef.current) {
        reviewedSubmissionKeys.current.add(pendingSubmissionKeyRef.current);
        pendingSubmissionKeyRef.current = null;
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        All Submissions
      </p>
      <Accordion
        type="single"
        collapsible
        value={openSubmissionKey}
        onValueChange={setOpenSubmissionKey}
        className="gap-3"
      >
        {applicant.submissions.map((submission, index) => {
          const roles = submission.roles ?? [];
          const isVolunteerPosting = normalizedSourceType === "volunteer";
          const supportingDocuments = isVolunteerPosting
            ? submission.volunteer?.supportingDocuments?.map(
                (doc, docIndex) => ({
                  id: `volunteer-file-${index}-${docIndex}`,
                  key: doc.key,
                  name:
                    doc.name ||
                    doc.key?.split("/").pop() ||
                    `Document ${docIndex + 1}`,
                  sizeLabel: "PDF",
                }),
              )
            : submission.project?.documentKeys?.map((key, docIndex) => ({
                id: `project-file-${index}-${docIndex}`,
                key,
                name:
                  submission.project?.documentNames?.[docIndex] ||
                  key?.split("/").pop() ||
                  `Document ${docIndex + 1}`,
                sizeLabel: "PDF",
              }));

          const isRoleTopPick = (role?: (typeof roles)[number]) => {
            if (!role || !submission.topPick) return false;
            return [role.roleId, role.applicationId].includes(
              submission.topPick,
            );
          };

          const infoItems: Array<{
            title: string;
            value: string | undefined;
            hide: boolean;
            valueClass?: string;
            link?: ReactNode;
          }> = isVolunteerPosting
            ? [
                {
                  title: "Availability",
                  value: submission.volunteer?.availability,
                  hide: !submission.volunteer?.availability,
                },
                {
                  title: "Relevant Experience",
                  value: submission.volunteer?.relevantExperience,
                  valueClass: "text-gray-600 leading-relaxed",
                  hide: !submission.volunteer?.relevantExperience,
                },
              ]
            : [
                {
                  title: "Why do you want to join this project?",
                  value: submission.project?.motivation,
                  hide: !submission.project?.motivation,
                },
                {
                  title: "Relevant Experience",
                  value: submission.project?.relevantExperience,
                  valueClass: "text-gray-600 leading-relaxed",
                  hide: !submission.project?.relevantExperience,
                },
                {
                  title: "Portfolio",
                  value: submission.project?.portfolio,
                  valueClass: "text-gray-600 leading-relaxed",
                  hide: !submission.project?.portfolio,
                  link: (
                    <a
                      href={submission.project?.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-blue-600 hover:underline"
                    >
                      {submission.project?.portfolio}
                    </a>
                  ),
                },
              ];

          return (
            <AccordionItem
              key={submission.submissionKey}
              value={submission.submissionKey}
              className="overflow-hidden rounded-2xl border border-blue-200 bg-white"
            >
              <AccordionTrigger className="items-center rounded-none border-b border-gray-100 px-4 py-3 hover:no-underline">
                <div className="flex w-full items-center gap-3 pr-3">
                  <span className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                    Submission #{applicant.submissions.length - index}
                  </span>
                  <span className="text-xs font-medium text-gray-500">
                    {formatDateMonthYear(submission.appliedAt)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <div className="space-y-4">
                  <section>
                    <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                      Applied Roles
                    </p>
                    <div className="flex flex-col gap-2">
                      {roles.map((role) => {
                        const isTopPick = isRoleTopPick(role);
                        const isApproved = APPROVED_STATUSES.includes(
                          role.status,
                        );
                        const isDeclined = DECLINED_STATUSES.includes(
                          role.status,
                        );

                        return (
                          <div
                            key={role.roleId}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                              isApproved
                                ? "border-green-300 bg-green-50"
                                : isDeclined
                                  ? "border-gray-200 bg-gray-50 opacity-60"
                                  : "border-gray-200 bg-white",
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={cn(
                                    "truncate text-sm font-semibold",
                                    isApproved
                                      ? "text-green-700"
                                      : isDeclined
                                        ? "text-gray-400"
                                        : "text-gray-900",
                                  )}
                                >
                                  {role.title}
                                </span>
                                <span
                                  className={cn(
                                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                                    ROLE_STATUS_STYLES[role.status],
                                  )}
                                >
                                  {ROLE_STATUS_LABELS[role.status]}
                                </span>
                                {isTopPick && (
                                  <span className="shrink-0 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 uppercase">
                                    Top Pick
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {infoItems.map((info) =>
                    info.hide ? null : (
                      <section
                        key={info.title}
                        className="border-t border-gray-100 pt-4"
                      >
                        <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                          {info.title}
                        </p>
                        <p
                          className={cn(
                            "text-sm leading-relaxed text-slate-600",
                            info.valueClass,
                          )}
                        >
                          {info.link || info.value}
                        </p>
                      </section>
                    ),
                  )}

                  {!!supportingDocuments?.length && (
                    <section className="border-t border-gray-100 pt-4">
                      <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                        Uploaded Document
                      </p>
                      <div className="flex flex-col gap-2">
                        {supportingDocuments.map((file) => (
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
                            <div className="min-w-0 flex-1">
                              <div className="line-clamp-1 text-sm font-medium text-[#0F1729]">
                                {file.name}
                              </div>
                              <div className="text-xs font-semibold text-[#99A1AF]">
                                {file.sizeLabel}
                              </div>
                            </div>
                            <DownloadIcon
                              className="shrink-0 text-[#D1D5DC]"
                              size={16}
                            />
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
