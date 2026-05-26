import { useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import { Send, Mail, Search } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
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
} from "~/services/manage-post/types";
import ApplicantTabRange from "./applicant-tab-filter";
import { formatDate } from "~/features/events/lib/event-formatters";
import ApplicantSideBar from "./applicant-side-bar";
import ApplicantActionButton from "./applicant-action-btn";

const STATUS_STYLES: Record<ApplicantStatusAction, string> = {
  approve: "bg-green-100 text-green-700 border-green-200 ",
  confirmed: "bg-green-100 text-green-700 border-green-200 ",
  completed: "bg-blue-100 text-blue-700 border-blue-200 ",
  decline: "bg-red-100 text-red-700 border-red-200 ",
  submitted: "bg-amber-100 text-amber-700 border-amber-200 ",
  under_review: "bg-purple-100 text-purple-700 border-purple-200 ",
};

const STATUS_LABELS: Record<ApplicantStatusAction, string> = {
  approve: "Approved",
  confirmed: "Confirmed",
  completed: "Completed",
  decline: "Declined",
  submitted: "Submitted",
  under_review: "Under Review",
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

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
    if (
      applicant.roles?.[0]?.applicationId === pendingApplicantId &&
      pendingStatus
    ) {
      return pendingStatus;
    }
    return normalizeStatus(applicant.status);
  };

  const handleRowClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    const normalized = normalizeStatus(applicant.status);
    const alreadyActioned = ["approve", "decline", "under_review"].includes(
      normalized,
    );

    if (!alreadyActioned) {
      const applicationId = applicant.roles?.[0]?.applicationId;
      if (!applicationId) return;

      const formData = new FormData();
      formData.append("applicationId", applicationId);
      formData.append("statusAction", "under_review");
      fetcher.submit(formData, { method: "POST" });
    }
  };

  const pendingApplicantId = fetcher.formData?.get("applicationId");
  const pendingStatus = fetcher.formData?.get(
    "statusAction",
  ) as ApplicantStatusAction | null;

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs sit neatly isolated above the table block */}
      <ApplicantTabRange />

      {/* Embedded Title, Search, and Data Box Header */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900 shadow-sm overflow-hidden flex flex-col">
        {/* Table Inner Layout Header Block */}
        <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 dark:border-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            All Applications
          </h2>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              className="h-9 pl-10 pr-4 text-[13px] border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl focus-visible:ring-blue-500/20 placeholder:text-slate-400 transition-all w-full"
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
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-900 text-[11px] font-bold uppercase tracking-wider">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-500 h-11 px-5">
                  Applicant
                </TableHead>
                <TableHead className="text-slate-500 h-11 px-5">
                  Applied For
                </TableHead>
                <TableHead className="text-slate-500 h-11 px-5">
                  Applied Date
                </TableHead>
                <TableHead className="text-slate-500  h-11 px-5">
                  Status
                </TableHead>
                <TableHead className=" text-slate-500 h-11 px-5">
                  Contact
                </TableHead>
                <TableHead className="text-right text-slate-500 h-11 px-5">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-50 dark:divide-slate-900">
              {(applicants ?? []).map((applicant, idx) => {
                const displayStatus = getDisplayStatus(applicant);
                return (
                  <TableRow
                    key={`${applicant.candidate.id} ${idx}`}
                    onClick={() => handleRowClick(applicant)}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors cursor-pointer"
                  >
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar className="border border-slate-100 dark:border-slate-800 shrink-0 h-9 w-9">
                          <AvatarImage
                            src={applicant.candidate.avatarUrl || ""}
                            alt={applicant.candidate.name || "User"}
                            className="object-cover"
                          />
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {applicant.candidate.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {applicant.candidate.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-3.5">
                      {(() => {
                        const approvedRole = applicant.roles?.find(
                          (r) => r.status === "APPROVED",
                        );
                        const primaryRole =
                          approvedRole ?? applicant.roles?.[0];
                        const otherRoles =
                          applicant.roles?.filter((r) => r !== primaryRole) ??
                          [];

                        return (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
                              {primaryRole?.title || "N/A"}
                            </span>
                            {otherRoles.length > 0 && (
                              <span className="text-[11px] text-slate-400 font-medium">
                                + {otherRoles.length} other role
                                {otherRoles.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>

                    <TableCell className="px-5 py-3.5 text-sm  text-slate-500 whitespace-nowrap">
                      {formatDate(applicant.appliedAt)}
                    </TableCell>

                    <TableCell className="px-5 py-3.5">
                      <Badge
                        className={cn(
                          "text-[12px] font-semibold px-2 py-0.5 tracking-wider rounded-md border capitalize pointer-events-none shadow-none",
                          STATUS_STYLES[displayStatus],
                        )}
                      >
                        {STATUS_LABELS[displayStatus]}
                      </Badge>
                    </TableCell>

                    <TableCell
                      className="px-5 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex   gap-1.5">
                        {applicant.candidate.email && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900"
                            aria-label="Compose email"
                          >
                            <Mail size={14} />
                          </Button>
                        )}
                        {applicant.candidate.telegramUsername && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-slate-50 text-slate-500 hover:bg-sky-50 hover:text-sky-600 dark:bg-slate-900"
                            aria-label="Telegram"
                          >
                            <Send size={14} />
                          </Button>
                        )}
                      </div>
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

              {(applicants ?? []).length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-slate-400 text-sm"
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
        applicant={selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        postingId={postingId}
        sourceType={sourceType}
      />
    </div>
  );
}
