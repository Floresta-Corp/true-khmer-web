import { useFetcher } from "react-router";
import type {
  Applicant,
  ApplicantStatusAction,
} from "~/services/manage-post/types";
import { Button } from "~/components/ui/button";
type Props = {
  currentStatus: ApplicantStatusAction;
  postingId: string;
  applicationId: string;
  sourceType: string;
  applicant: Applicant;
  selectedRoleId?: string | null;
};

const FINALIZED_APPROVED = ["APPROVED", "CONFIRMED", "COMPLETED"] as const;
const FINALIZED_DECLINED = ["DECLINED", "WITHDRAWN"] as const;

const displayLabel: Record<string, string> = {
  APPROVED: "approved",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  DECLINED: "declined",
  WITHDRAWN: "withdrawn",
  UNDER_REVIEW: "under review",
  SUBMITTED: "submitted",
};
export default function ApplicantStatusChangeButton({
  applicationId,
  applicant,
  selectedRoleId,
}: Props) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  const hasMultipleRoles = (applicant?.roles?.length ?? 0) > 1;

  const resolvedApplicationId = hasMultipleRoles
    ? (applicant.roles?.find((r) => r.roleId === selectedRoleId)
        ?.applicationId ?? null)
    : applicationId;

  const handleStatusChange = (statusAction: "approve" | "decline") => {
    if (!resolvedApplicationId) return;

    const formData = new FormData();
    formData.append("applicationId", resolvedApplicationId);
    formData.append("statusAction", statusAction);
    fetcher.submit(formData, {
      method: "POST",
      // applicationId: applicant.id,
      action: window.location.pathname,
    });
  };

  const pendingAction = fetcher.formData?.get("statusAction") as
    | "approve"
    | "decline"
    | null;
  const isFinalPending =
    fetcher.state !== "idle" &&
    (pendingAction === "approve" || pendingAction === "decline");

  const normalizedStatus = applicant?.status?.toUpperCase();
  const isServerApproved = (FINALIZED_APPROVED as readonly string[]).includes(
    normalizedStatus,
  );
  const isServerDeclined = (FINALIZED_DECLINED as readonly string[]).includes(
    normalizedStatus,
  );
  const isServerFinalized = isServerApproved || isServerDeclined;
  const isFinalStatus = isServerFinalized || isFinalPending;
  const isApprovedSide =
    isServerApproved || (!isServerDeclined && pendingAction === "approve");

  const declineDisabled = isLoading || !resolvedApplicationId;

  return (
    <div className="mt-auto p-6 flex flex-col gap-2 border-t border-gray-100">
      {isFinalStatus ? (
        <p className="text-center text-sm text-gray-400">
          This applicant has been{" "}
          <span
            className={isApprovedSide ? "text-emerald-600" : "text-red-500"}
          >
            {isFinalPending
              ? pendingAction === "approve"
                ? "approved"
                : "declined"
              : (displayLabel[normalizedStatus] ??
                normalizedStatus?.toLowerCase())}
          </span>
          .
        </p>
      ) : (
        <>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl h-11"
            onClick={() => handleStatusChange("approve")}
            disabled={declineDisabled}
          >
            {isFinalPending && pendingAction === "approve"
              ? "Saving..."
              : "Approve"}
          </Button>

          {hasMultipleRoles && !selectedRoleId && (
            <p className="text-center text-xs text-gray-400">
              Select a role above to approve
            </p>
          )}

          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold rounded-xl h-11"
            onClick={() => handleStatusChange("decline")}
            disabled={isLoading}
          >
            {isFinalPending && pendingAction === "decline"
              ? "Saving..."
              : "Decline"}
          </Button>
        </>
      )}
    </div>
  );
}
