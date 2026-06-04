import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  CalendarClock,
  CheckCircle,
  Copy,
  Globe,
  MoreHorizontal,
  Pencil,
  Share2,
  Star,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import VolunteerDateRangeField from "~/features/volunteer/components/volunteer-date-range-field";
import VolunteerDatePickerField from "~/features/volunteer/components/volunteer-date-picker-field";
import type {
  ManagePostStatus,
  PostingType,
  SourceType,
  UpdateManagePostResponse,
} from "~/services/manage-post/types";

type Props = {
  status: ManagePostStatus;
  sourceType: SourceType | PostingType;
  postingId: string;
  currentDeadline?: string | null;
  title: string;
};

const SOURCE_TYPE_TO_ROUTE: Record<string, "projects" | "volunteer"> = {
  PROJECT: "projects",
  projects: "projects",
  VOLUNTEER: "volunteer",
  volunteer: "volunteer",
};

export default function ManagePostOption({
  status,
  sourceType,
  postingId,
  currentDeadline,
  title,
}: Props) {
  const fetcher = useFetcher();
  const extendDeadlineFetcher = useFetcher<{
    success?: boolean;
    ok?: boolean;
    error?: string;
  }>();
  const navigate = useNavigate();

  console.log("RECEIVED TITLE PROPS:", title); // <--- Add this
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [deadlineError, setDeadlineError] = useState<string>();
  const wasExtendingDeadline = useRef(false);

  const managePostSourceType = SOURCE_TYPE_TO_ROUTE[sourceType] ?? "volunteer";
  const sourceTypeRoute =
    managePostSourceType === "projects" ? "launchpad" : "volunteer";
  const editRoute = `/${sourceTypeRoute}/edit/${postingId}`;
  const isVolunteerPosting = managePostSourceType === "volunteer";

  const handleAction = (postingAction: UpdateManagePostResponse) => {
    fetcher.submit(
      { postingAction },
      {
        method: "POST",
        action: `/manage-post/${managePostSourceType}/${postingId}`,
      },
    );
  };
  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    navigate(editRoute);
  };

  const isExtendingDeadline = extendDeadlineFetcher.state !== "idle";

  const handleExtendDeadline = () => {
    if (!deadline) {
      setDeadlineError("Please select a new deadline.");
      return;
    }

    if (
      currentDeadline &&
      new Date(deadline).getTime() <= new Date(currentDeadline).getTime()
    ) {
      setDeadlineError("New deadline must be after the current deadline.");
      return;
    }

    setDeadlineError(undefined);
    wasExtendingDeadline.current = true;
    extendDeadlineFetcher.submit(
      {
        actionType: "extend-deadline",
        deadline,
      },
      {
        method: "POST",
        action: `/manage-post/${managePostSourceType}/${postingId}`,
      },
    );
  };

  useEffect(() => {
    if (
      !wasExtendingDeadline.current ||
      extendDeadlineFetcher.state !== "idle" ||
      !extendDeadlineFetcher.data
    ) {
      return;
    }

    wasExtendingDeadline.current = false;

    if (extendDeadlineFetcher.data.success || extendDeadlineFetcher.data.ok) {
      toast.success("Deadline extended successfully.");
      setDeadline("");
      setDeadlineDialogOpen(false);
      return;
    }

    toast.error(
      extendDeadlineFetcher.data.error ?? "Unable to extend deadline.",
    );
  }, [extendDeadlineFetcher.data, extendDeadlineFetcher.state]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="h-11 w-11 rounded-xl  text-gray-400 bg-white hover:text-blue-600 hover:border-blue-600 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <MoreHorizontal size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align="end"
          className="w-52 rounded-2xl p-2 shadow-xl border-gray-100"
        >
          {status === "LIVE" && (
            <>
              <DropdownMenuItem
                onClick={handleEdit}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Pencil size={16} className="text-slate-400" />
                Edit Posting
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleAction("close")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <X size={16} className="text-slate-400" />
                Close Recruitment
              </DropdownMenuItem>
              {/* <DropdownMenuItem
              // onClick={() => handleAction("SHARE")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Share2 size={16} className="text-slate-400" />
              Share Posting
            </DropdownMenuItem> */}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => handleAction("cancel")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
              >
                <Trash2 size={16} />
                Cancel Posting
              </DropdownMenuItem>
            </>
          )}

          {status === "IN_PROGRESS" && (
            <>
              <DropdownMenuItem
                onClick={handleEdit}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Pencil size={16} className="text-slate-400" />
                Edit Posting
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeadline("");
                  setDeadlineError(undefined);
                  setDeadlineDialogOpen(true);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <CalendarClock size={16} className="text-slate-400" />
                Extend Deadline
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("mark_complete")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-green-600 font-medium"
              >
                <CheckCircle size={16} className="text-green-600" />
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => handleAction("cancel")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
              >
                <Trash2 size={16} />
                Cancel Posting
              </DropdownMenuItem>
            </>
          )}

          {status === "DRAFT" && (
            <>
              <DropdownMenuItem
                onClick={handleEdit}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Pencil size={16} className="text-slate-400" />
                Edit Posting
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Globe size={16} className="text-slate-400" />
                Publish
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => handleAction("delete")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </DropdownMenuItem>
            </>
          )}

          {status === "COMPLETED" && (
            <>
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Users size={16} className="text-slate-400" />
                View Participants
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Star size={16} className="text-slate-400" />
                Rate Participants
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
              >
                <Archive size={16} className="text-slate-400" />
                Archive Project
              </DropdownMenuItem>
            </>
          )}

          {status === "CANCELED" && (
            <>
              <DropdownMenuItem
                onClick={() => handleAction("delete")}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
              >
                <Trash2 size={16} />
                Delete Posting
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deadlineDialogOpen} onOpenChange={setDeadlineDialogOpen}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          className="max-w-md rounded-2xl p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-lg">Extend Deadline</DialogTitle>
            <DialogDescription>
              Select the new application deadline for
              <span className="font-bold "> "{title}".</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {isVolunteerPosting ? (
              <VolunteerDateRangeField
                startDate={currentDeadline || undefined}
                endDate={deadline || undefined}
                onChange={({ startDate, endDate }) => {
                  setDeadline(endDate || startDate);
                  setDeadlineError(undefined);
                }}
                error={deadlineError}
                placeholder="Select new deadline"
              />
            ) : (
              <VolunteerDatePickerField
                value={deadline}
                onChange={(value) => {
                  setDeadline(value);
                  setDeadlineError(undefined);
                }}
                error={deadlineError}
                placeholder="Select new deadline"
              />
            )}
          </div>

          <DialogFooter className="mt-2 border-0 bg-transparent p-3 ">
            <Button
              variant="outline"
              className="cursor-pointer p-4"
              disabled={isExtendingDeadline}
              onClick={() => setDeadlineDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600 p-4 px-4 "
              disabled={isExtendingDeadline}
              onClick={handleExtendDeadline}
            >
              {isExtendingDeadline ? "Extending..." : "Confirm Deadline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
