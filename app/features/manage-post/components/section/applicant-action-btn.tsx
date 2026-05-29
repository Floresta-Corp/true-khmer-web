import { ExternalLink, ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type {
  Applicant,
  ApplicantStatusAction,
} from "~/services/manage-post/types";
import { useFetcher } from "react-router";

type Props = {
  applicant: Applicant;
  displayStatus: ApplicantStatusAction;
  onViewDetail: (applicant: Applicant) => void;
};

const isActioned = (status: ApplicantStatusAction) =>
  ["confirmed", "completed", "decline"].includes(status);

export default function ApplicantActionButton({
  applicant,
  displayStatus,
  onViewDetail,
}: Props) {
  const fetcher = useFetcher();

  const handleAction = (
    e: React.MouseEvent,
    statusAction: "approve" | "decline",
  ) => {
    e.stopPropagation();
    if (applicant.submissions[0]?.roles.length !== 1) {
      onViewDetail(applicant);
      return;
    }
    const applicationId = applicant.submissions[0]?.roles[0]?.applicationId;
    if (!applicationId) return;

    const formData = new FormData();
    formData.append("applicationId", applicationId);
    formData.append("statusAction", statusAction);
    fetcher.submit(formData, { method: "POST" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gray-600"
          aria-label="More actions"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={14} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-2xl p-1.5 shadow-xl"
      >
        <DropdownMenuItem
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(applicant);
          }}
        >
          <ExternalLink size={14} className="text-gray-400" />
          View Full Detail
        </DropdownMenuItem>

        {!isActioned(displayStatus) &&
          applicant.submissions[0]?.roles.length === 1 && (
            <>
              <DropdownMenuSeparator className="my-1" />
              {displayStatus !== "approve" && (
                <DropdownMenuItem
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-green-600 cursor-pointer focus:text-green-600 focus:bg-green-50"
                  onClick={(e) => handleAction(e, "approve")}
                >
                  Approve
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-50"
                onClick={(e) => handleAction(e, "decline")}
              >
                Decline
              </DropdownMenuItem>
            </>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
