import { useFetcher } from "react-router";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";
import type {
  Applicant,
  ApplicationStatus,
} from "~/services/manage-post/types";
import { Button } from "~/components/ui/button";

type Props = {
  currentStatus: ApplicationStatus;
  postingId: string;
  applicationId: string;
  sourceType: string;
  applicant: Applicant;
};

export default function ApplicantStatusChangeButton({
  applicationId,
  applicant,
}: Props) {
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== "idle";

  const handleStatusChange = (statusAction: "approve" | "decline") => {
    const formData = new FormData();
    formData.append("applicationId", applicationId);
    formData.append("statusAction", statusAction);

    fetcher.submit(formData, {
      method: "POST",
      action: window.location.pathname,
    });
  };

  const normalizedStatus = applicant?.status?.toUpperCase();
  const pendingAction = fetcher.formData?.get("statusAction");

  const isFinalPending =
    pendingAction === "approve" || pendingAction === "decline";
  const isServerFinalized = [
    "APPROVED",
    "CONFIRMED",
    "COMPLETED",
    "DECLINED",
    "WITHDRAWN",
  ].includes(applicant?.status?.toUpperCase());

  const isFinalStatus = isFinalPending || isServerFinalized;

  const displayAction: "approve" | "decline" = isFinalPending
    ? (pendingAction as "approve" | "decline")
    : normalizedStatus === "DECLINED" || normalizedStatus === "WITHDRAWN"
      ? "decline"
      : "approve";

  return (
    <div className="mt-auto p-6 flex flex-col gap-2 border-t border-gray-100">
      {isFinalStatus ? (
        <p className="text-center text-sm text-gray-400">
          This applicant has been{" "}
          <span
            className={
              displayAction === "approve" ? "text-emerald-600" : "text-red-500"
            }
          >
            {displayAction === "approve" ? "approved" : "declined"}
          </span>
          .
        </p>
      ) : (
        <>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-11"
            onClick={() => handleStatusChange("approve")}
            disabled={isLoading}
          >
            {fetcher.state === "submitting" ? "Saving..." : "Approve"}
          </Button>

          <Button
            variant="ghost"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-semibold rounded-xl h-11"
            onClick={() => handleStatusChange("decline")}
            disabled={isLoading}
          >
            Decline
          </Button>
        </>
      )}
    </div>
  );
}
