import { useFetcher } from "react-router";
import { CircleCheck, Eye } from "lucide-react";
import type {
  Applicant,
  ApplicantStatusAction,
} from "~/services/manage-post/types";
import { Button } from "~/components/ui/button";
import ApplicantContactPopover from "./applicant-contact-popover";
type Props = {
  currentStatus: ApplicantStatusAction;
  postingId: string;
  applicationId: string;
  sourceType: string;
  applicant: Applicant;
  selectedRoleId?: string | null;
};

const FINALIZED_APPROVED = ["CONFIRMED", "COMPLETED"] as const;
const FINALIZED_DECLINED = ["DECLINED", "WITHDRAWN"] as const;

const displayLabel: Record<string, string> = {
  APPROVED: "approved",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  DECLINED: "declined",
  WITHDRAWN: "withdrawn",
  UNDER_REVIEW: "under review",
  SUBMITTED: "new",
};
export default function ApplicantStatusChangeButton({
  applicationId,
  applicant,
  selectedRoleId,
}: Props) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  const hasMultipleRoles = (applicant?.submissions[0]?.roles?.length ?? 0) > 1;
  const approvedRole = applicant?.submissions[0]?.roles?.find((r) =>
    ["APPROVED", "CONFIRMED", "COMPLETED"].includes(r.status),
  );

  const resolvedApplicationId = hasMultipleRoles
    ? (applicant.submissions[0]?.roles?.find((r) => r.roleId === selectedRoleId)
        ?.applicationId ??
      approvedRole?.applicationId ??
      null)
    : applicationId;

  const handleStatusChange = (statusAction: "approve" | "under_review") => {
    if (!resolvedApplicationId) return;

    const formData = new FormData();
    formData.append("applicationId", resolvedApplicationId);
    formData.append("statusAction", statusAction);
    fetcher.submit(formData, {
      method: "POST",
      action: window.location.pathname,
    });
  };

  const pendingAction = fetcher.formData?.get("statusAction") as
    | "approve"
    | "under_review"
    | null;
  const isFinalPending =
    fetcher.state !== "idle" && pendingAction === "approve";

  const normalizedStatus = applicant?.overallStatus?.toUpperCase();
  const isServerApproved = (FINALIZED_APPROVED as readonly string[]).includes(
    normalizedStatus,
  );
  const isPendingCandidateConfirmation = normalizedStatus === "APPROVED";
  const isServerDeclined = (FINALIZED_DECLINED as readonly string[]).includes(
    normalizedStatus,
  );
  const isServerFinalized = isServerApproved || isServerDeclined;
  const isFinalStatus = isServerFinalized || isFinalPending;
  const isApprovedSide = isServerApproved || isPendingCandidateConfirmation;
  const isCurrentlyUnderReview = normalizedStatus === "UNDER_REVIEW";

  const approveDisabled = isLoading || !resolvedApplicationId;
  const underReviewDisabled = isLoading || !resolvedApplicationId;

  return (
    <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 p-6">
      {isPendingCandidateConfirmation && !isFinalPending ? (
        <>
          <p className="text-center text-sm text-gray-400">
            This applicant has been{" "}
            <span className="text-emerald-600">approved</span>.
          </p>
          <ApplicantContactPopover candidate={applicant.candidate} />
        </>
      ) : isFinalStatus ? (
        <>
          <ApplicantContactPopover candidate={applicant.candidate} />
          <p className="text-center text-sm text-gray-400">
            This applicant has been{" "}
            <span
              className={isApprovedSide ? "text-emerald-600" : "text-red-500"}
            >
              {isFinalPending
                ? "approved"
                : (displayLabel[normalizedStatus] ??
                  normalizedStatus?.toLowerCase())}
            </span>
            .
          </p>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <ApplicantContactPopover candidate={applicant.candidate} />
            <Button
              className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => handleStatusChange("approve")}
              disabled={approveDisabled}
            >
              <CircleCheck className="size-4" />
              {isFinalPending && pendingAction === "approve"
                ? "Saving..."
                : "Process"}
            </Button>
          </div>

          {hasMultipleRoles && !selectedRoleId && (
            <p className="text-center text-xs text-gray-400">
              Select a role above to continue
            </p>
          )}

          {/* <Button
            variant="outline"
            className="h-10 w-full rounded-xl border-purple-200 font-semibold text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            onClick={() => handleStatusChange("under_review")}
            disabled={underReviewDisabled || isCurrentlyUnderReview}
          >
            <Eye className="size-4 mr-1.5" />
            {isCurrentlyUnderReview
              ? "Under Review"
              : "Mark Under Review"}
          </Button> */}
        </>
      )}
    </div>
  );
}
