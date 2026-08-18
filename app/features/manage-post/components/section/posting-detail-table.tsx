import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { cn, resolveImageURL } from "~/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type {
  Applicant,
  ApplicantStatusAction,
  PostingType,
} from "~/features/manage-post/types";
import ApplicantTabRange from "./applicant-tab-filter";
import { formatDateMonthYear } from "~/features/events/lib/event-formatters";
import ApplicantSideBar from "./applicant-side-bar";
import ApplicantActionButton from "./applicant-action-btn";
import ApplicantContactBtn from "./applicant-contact-btn";

const STATUS_STYLES: Record<ApplicantStatusAction, string> = {
  approve: "bg-green-100 text-green-700 border-green-200 ",
  confirmed: "bg-green-100 text-green-700 border-green-200 ",
  completed: "bg-green-100 text-green-700 border-green-200 ",
  new: "bg-blue-100 text-blue-700 border-blue-200 ",
  decline: "bg-red-100 text-red-700 border-red-200 ",
  submitted: "bg-amber-100 text-amber-700 border-amber-200 ",
  under_review: "bg-purple-100 text-purple-700 border-purple-200 ",
};

const STATUS_LABELS: Record<ApplicantStatusAction, string> = {
  approve: "Approved",
  confirmed: "Confirmed",
  completed: "Completed",
  decline: "Declined",
  new: "New",
  submitted: "Submitted",
  under_review: "Under Review",
};

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

type Props = {
  applicants: Applicant[];
  postingId: string;
  sourceType: PostingType;
};

export default function ManagePostingDetailTable({
  applicants,
  postingId,
  sourceType,
}: Props) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [localApplicants, setLocalApplicants] = useState(applicants ?? []);
  const [blockedCandidateIds, setBlockedCandidateIds] = useState<Set<string>>(
    () => {
      if (typeof window === "undefined") return new Set();
      try {
        const raw = localStorage.getItem(`blocked-${postingId}`);
        const arr = raw ? JSON.parse(raw) : [];
        return new Set(
          Array.isArray(arr)
            ? arr.filter((x): x is string => typeof x === "string")
            : [],
        );
      } catch {
        localStorage.removeItem(`blocked-${postingId}`);
        return new Set();
      }
    },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(`blocked-${postingId}`);
      const arr = raw ? JSON.parse(raw) : [];
      setBlockedCandidateIds(
        new Set(
          Array.isArray(arr)
            ? arr.filter((x): x is string => typeof x === "string")
            : [],
        ),
      );
    } catch {
      localStorage.removeItem(`blocked-${postingId}`);
      setBlockedCandidateIds(new Set());
    }
  }, [postingId]);

  useEffect(() => {
    setLocalApplicants(applicants ?? []);
  }, [applicants]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params, { replace: true });
  };

  const getDisplayStatus = (applicant: Applicant): ApplicantStatusAction => {
    return normalizeStatus(applicant.overallStatus);
  };

  const handleRowClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* filter applicant  */}
      <ApplicantTabRange />

      {/* Embedded Title, Search, and Data Box Header */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-900 dark:bg-slate-950">
        {/* Table Inner Layout Header Block */}
        <div className="flex flex-col gap-4 border-b border-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-900">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            All Applications
          </h2>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            />
            <Input
              className="h-9 w-full rounded-xl border-slate-200 bg-slate-50/50 pr-4 pl-10 text-[13px] transition-all placeholder:text-slate-400 focus-visible:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/50"
              placeholder="Search applicants..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Responsive Scrolling Core Layout Wrapper */}
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold tracking-wider uppercase dark:border-slate-900 dark:bg-slate-900/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 px-5 text-slate-500">
                  Applicant
                </TableHead>
                <TableHead className="h-11 px-5 text-slate-500">
                  Submission
                </TableHead>
                <TableHead className="h-11 px-5 text-slate-500">
                  Applied for
                </TableHead>
                <TableHead className="h-11 px-5 text-slate-500">
                  Status
                </TableHead>
                <TableHead className="h-11 px-5 text-slate-500">
                  Contact
                </TableHead>
                <TableHead className="h-11 px-5 text-right text-slate-500">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-50 dark:divide-slate-900">
              {(localApplicants ?? []).map((applicant, idx) => {
                const displayStatus = getDisplayStatus(applicant);
                const isBlocked = blockedCandidateIds.has(
                  applicant.candidate.id,
                );

                return (
                  <TableRow
                    key={`${applicant.candidate.id} ${idx}`}
                    onClick={() => handleRowClick(applicant)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/40 dark:hover:bg-slate-900/20"
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0 border border-slate-100 dark:border-slate-800">
                          <AvatarImage
                            src={resolveImageURL(applicant.candidate.avatarKey)}
                            alt={applicant.candidate.name || "User"}
                            className="object-cover"
                          />
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                              {applicant.candidate.name}
                            </p>
                            {isBlocked && (
                              <span className="shrink-0 rounded-md border border-red-200 bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                                Blocked
                              </span>
                            )}
                          </div>

                          <p className="truncate text-xs text-slate-400">
                            {applicant.candidate.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-3.5">
                      {(() => {
                        const submissionCount =
                          applicant.submissionCount ??
                          applicant.submissions.length;

                        return (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                              {submissionCount} submission
                              {submissionCount > 1 ? "s" : ""}
                            </span>

                            <span className="text-[11px] font-medium text-slate-400">
                              {formatDateMonthYear(
                                applicant.lastAppliedAt ??
                                  applicant.submissions[0]?.appliedAt ??
                                  "",
                              )}
                            </span>
                          </div>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="px-5 py-3.5 text-sm whitespace-nowrap text-slate-500">
                      {(() => {
                        const totalRoles =
                          applicant.totalRoleApplied ??
                          applicant.submissions.reduce(
                            (total, submission) =>
                              total + submission.roles.length,
                            0,
                          );

                        const otherRoles = Math.max(0, totalRoles - 1);

                        return (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-black">
                              {applicant.submissions.length > 0
                                ? applicant.submissions.map((s) =>
                                    s.roles.map((r) => r.title),
                                  )[0]?.[0]
                                : "N/A"}
                            </span>
                            {otherRoles > 0 && (
                              <span className="text-[11px] font-medium text-slate-400">
                                {otherRoles} other role
                                {otherRoles > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="px-5 py-3.5">
                      <Badge
                        className={cn(
                          "pointer-events-none rounded-md border px-2 py-0.5 text-[12px] font-semibold tracking-wider capitalize shadow-none",
                          STATUS_STYLES[displayStatus],
                        )}
                      >
                        {STATUS_LABELS[displayStatus]}
                      </Badge>
                    </TableCell>

                    <TableCell
                      className="size-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ApplicantContactBtn candidate={applicant.candidate} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ApplicantActionButton
                        applicant={applicant}
                        displayStatus={displayStatus}
                        onViewDetail={setSelectedApplicant}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}

              {(localApplicants ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-slate-400"
                  >
                    No applicants found for this project.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ApplicantSideBar
        applicant={
          localApplicants.find(
            (a) => a.candidate.id === selectedApplicant?.candidate.id,
          ) ?? null
        }
        onClose={() => setSelectedApplicant(null)}
        postingId={postingId}
        sourceType={sourceType}
        candidateId={selectedApplicant?.candidate.id ?? ""}
        onApplicantDeclined={(candidateId, { blocked }) => {
          setLocalApplicants((current) =>
            current.map((a) =>
              a.candidate.id === candidateId
                ? { ...a, overallStatus: "DECLINED" }
                : a,
            ),
          );
          if (blocked) {
            setBlockedCandidateIds((prev) => {
              const next = new Set(prev).add(candidateId);
              localStorage.setItem(
                `blocked-${postingId}`,
                JSON.stringify([...next]),
              );
              return next;
            });
          }
        }}
      />
    </div>
  );
}
