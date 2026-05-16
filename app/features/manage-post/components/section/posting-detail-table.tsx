import { useFetcher, useSearchParams } from "react-router";
import { Send, Mail, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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
import { useState } from "react";
import ApplicantTabRange from "./applicant-tab-range";
import { formatDate } from "~/features/events/lib/event-formatters";
import ApplicantSideBar from "./applicant-side-bar";

type RangeType = "today" | "this_week" | "all_time";

const VALID_RANGE = ["today", "this_week", "all_time"] as const;
function isValidTab(value: string | null): value is RangeType {
  return value !== null && VALID_RANGE.includes(value as RangeType);
}

const STATUS_STYLES: Record<ApplicantStatusAction, string> = {
  approve: "bg-green-100 text-green-700 border-green-200",
  decline: "bg-red-100 text-red-700 border-red-200",
  submitted: "bg-amber-100 text-amber-700 border-amber-200",
  under_review: "bg-purple-100 text-purple-700 border-purple-200",
};

const STATUS_LABELS: Record<ApplicantStatusAction, string> = {
  approve: "Approved",
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

  const [searchParams] = useSearchParams();
  const rawType = searchParams.get("range");
  const activeType = isValidTab(rawType) ? rawType : "all_time";
  const searchQuery = searchParams.get("search") ?? "";
  const fetcher = useFetcher();

  const getDisplayStatus = (applicant: Applicant): ApplicantStatusAction => {
    if (applicant.id === pendingApplicationId && pendingStatus) {
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
      const formData = new FormData();
      formData.append("applicationId", applicant.id);
      formData.append("statusAction", "under_review");
      fetcher.submit(formData, { method: "POST" });
    }
  };
  const filteredApplicants = (applicants ?? []).filter((applicant) => {
    const appliedAt = new Date(applicant.appliedAt);
    const now = new Date();

    if (activeType === "today") {
      const isToday =
        appliedAt.getDate() === now.getDate() &&
        appliedAt.getMonth() === now.getMonth() &&
        appliedAt.getFullYear() === now.getFullYear();
      if (!isToday) return false;
    }

    if (activeType === "this_week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      if (appliedAt < startOfWeek) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = applicant.candidate.name?.toLowerCase().includes(q);
      const matchesEmail = applicant.candidate.email?.toLowerCase().includes(q);
      const matchesRole = applicant.role.title?.toLowerCase().includes(q);
      if (!matchesName && !matchesEmail && !matchesRole) return false;
    }

    return true;
  });
  const syncedApplicant = selectedApplicant
    ? (applicants.find((a) => a.id === selectedApplicant.id) ??
      selectedApplicant)
    : null;

  const pendingApplicationId = fetcher.formData?.get("applicationId");
  const pendingStatus = fetcher.formData?.get(
    "statusAction",
  ) as ApplicantStatusAction | null;

  // 🔍 DEBUG - remove after fixing
  console.log("[Table fetcher state]", fetcher.state);
  console.log("[Table pending]", { pendingApplicationId, pendingStatus });
  console.log(
    "[Applicants from loader]",
    applicants.map((a) => ({ id: a.id, status: a.status })),
  );

  return (
    <>
      <ApplicantTabRange />
      <div className="bg-white rounded-2xl border border-gray-100 p-2.5 flex flex-col gap-4">
        <div className="overflow-x-auto rounded-2xl">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-gray-100 text-[12px] font-bold uppercase tracking-widest">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Candidate
                </TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Role Applied
                </TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Applied On
                </TableHead>
                <TableHead className="text-slate-600 dark:text-slate-400 h-12 p-4">
                  Status
                </TableHead>
                <TableHead className="text-center text-slate-600 dark:text-slate-400 h-12 p-4">
                  Contact
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {filteredApplicants.map((applicant) => {
                const displayStatus = getDisplayStatus(applicant);
                return (
                  <TableRow
                    key={applicant.id}
                    onClick={() => handleRowClick(applicant)}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="border border-[#f3f4f6] shrink-0 h-10 w-10">
                          <AvatarImage
                            src={applicant.candidate.avatarUrl || ""}
                            alt={applicant.candidate.name || "User"}
                            className="object-cover"
                          />
                        </Avatar>
                        <div>
                          <p className="text-[15px] font-semibold text-gray-900">
                            {applicant.candidate.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {applicant.candidate.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-50">
                        {applicant.role.title}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(applicant.appliedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "text-xs font-semibold border capitalize",
                          STATUS_STYLES[displayStatus],
                        )}
                      >
                        {STATUS_LABELS[displayStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-blue-100/60 text-blue-500 hover:text-gray-600"
                          aria-label="Send message"
                        >
                          <Send size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          aria-label="Compose email"
                        >
                          <Mail size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          aria-label="More actions"
                        >
                          <MoreVertical size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredApplicants.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-slate-400"
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
        applicant={syncedApplicant}
        onClose={() => setSelectedApplicant(null)}
        postingId={postingId}
        sourceType={sourceType}
      />
    </>
  );
}
