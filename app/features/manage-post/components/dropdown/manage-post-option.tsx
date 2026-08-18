import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Archive,
  Calendar,
  CalendarClock,
  CheckCircle,
  Globe,
  MoreHorizontal,
  Pencil,
  Share2,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import VolunteerDatePickerField from "~/features/volunteer/components/volunteer-date-picker-field";
import type {
  ManagePostStatus,
  PostingType,
  SourceType,
  UpdateManagePostResponse,
} from "~/features/manage-post/types";
import { Separator } from "~/components/ui/separator";
import { formatDateMonthYear } from "~/features/events/lib/event-formatters";
import { addDays, isValid } from "date-fns";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";

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

const PRESET_DATE = [
  { label: "+7 days", days: 7 },
  { label: "+14 days", days: 14 },
  { label: "+30 days", days: 30 },
];

export default function ManagePostOption({
  status,
  sourceType,
  postingId,
  currentDeadline,
  title,
}: Props) {
  const fetcher = useFetcher<{
    success?: boolean;
    ok?: boolean;
    error?: string;
    message?: string;
  }>();
  const extendDeadlineFetcher = useFetcher<{
    success?: boolean;
    ok?: boolean;
    error?: string;
  }>();
  const navigate = useNavigate();
  const [deadlineDialogOpen, setDeadlineDialogOpen] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [deadlineError, setDeadlineError] = useState<string>();
  const wasPostingAction = useRef(false);
  const wasExtendingDeadline = useRef(false);

  const managePostSourceType = SOURCE_TYPE_TO_ROUTE[sourceType] ?? "volunteer";
  const sourceTypeRoute =
    managePostSourceType === "projects" ? "launchpad" : "volunteer";
  const editRoute = `/${sourceTypeRoute}/edit/${postingId}`;

  const handleAction = (postingAction: UpdateManagePostResponse) => {
    wasPostingAction.current = true;
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

  const handleSharePosting = () => {
    copyToClipboard(buildAbsoluteUrl(`/launchpad/detail/${postingId}`));
  };

  const isProject = managePostSourceType === "projects";

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
        actionType: "extend-application-deadline",
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
      !wasPostingAction.current ||
      fetcher.state !== "idle" ||
      !fetcher.data
    ) {
      return;
    }

    wasPostingAction.current = false;

    if (fetcher.data.success || fetcher.data.ok) {
      toast.success("Posting updated successfully.");
      return;
    }

    toast.error(
      fetcher.data.error ?? fetcher.data.message ?? "Unable to update posting.",
    );
  }, [fetcher.data, fetcher.state]);

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

  const [pickerKey, setPickerKey] = useState(0);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open posting actions"
            onClick={(e) => e.stopPropagation()}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-white text-gray-400 hover:border-blue-600 hover:text-blue-600"
          >
            <MoreHorizontal size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align="end"
          className="w-52 rounded-2xl border-gray-100 p-2 shadow-xl"
        >
          {status === "LIVE" && (
            <>
              <DropdownMenuItem
                onClick={handleEdit}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <Pencil size={16} className="text-slate-400" />
                Edit Posting
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleAction("close")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <X size={16} className="text-slate-400" />
                Close Recruitment
              </DropdownMenuItem>
              {isProject && (
                <DropdownMenuItem
                  onClick={handleSharePosting}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
                >
                  <Share2 size={16} className="text-slate-400" />
                  Share Posting
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => handleAction("cancel")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-red-500 focus:bg-red-50 focus:text-red-500"
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
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <Pencil size={16} className="text-slate-400" />
                Edit Posting
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeadline(currentDeadline ?? "");
                  setDeadlineError(undefined);
                  setDeadlineDialogOpen(true);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <CalendarClock size={16} className="text-slate-400" />
                Extend Deadline
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("mark_complete")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-green-600"
              >
                <CheckCircle size={16} className="text-green-600" />
                Mark as Completed
              </DropdownMenuItem>
              {isProject && (
                <DropdownMenuItem
                  onClick={handleSharePosting}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
                >
                  <Share2 size={16} className="text-slate-400" />
                  Share Posting
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => handleAction("cancel")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-red-500 focus:bg-red-50 focus:text-red-500"
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
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <Pencil size={16} className="text-slate-400" />
                Edit Posting
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <Globe size={16} className="text-slate-400" />
                Publish
              </DropdownMenuItem>
              {isProject && (
                <DropdownMenuItem
                  onClick={handleSharePosting}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
                >
                  <Share2 size={16} className="text-slate-400" />
                  Share Posting
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={() => handleAction("delete")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-red-500 focus:bg-red-50 focus:text-red-500"
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
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <Users size={16} className="text-slate-400" />
                View Participants
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
              >
                <Star size={16} className="text-slate-400" />
                Rate Participants
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                // onClick={() => handleAction("")}
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-slate-700"
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
                className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 font-medium text-red-500 focus:bg-red-50 focus:text-red-500"
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
          className="max-w-md rounded-2xl px-6 py-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
              <Calendar className="text-blue-600" size={22} />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-gray-900">
                Confirm Application Deadline
              </DialogTitle>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {title}
              </p>
            </div>
          </div>
          <Separator />
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-1 flex justify-between text-sm font-semibold text-slate-500">
              <span>Current Deadline</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {currentDeadline
                  ? formatDateMonthYear(currentDeadline)
                  : "No deadline set"}
              </span>
            </div>
          </div>
          <span className="text-sm font-semibold tracking-wide text-gray-700">
            New Deadline <span className="text-red-500">*</span>
          </span>

          <div className="space-y-2">
            <VolunteerDatePickerField
              key={pickerKey}
              value={deadline}
              onChange={(value) => {
                setDeadline(value);
                setDeadlineError(undefined);
              }}
              error={deadlineError}
              placeholder="Select new deadline"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Quick presets
            </span>
            <div className="flex gap-2">
              {PRESET_DATE.map(({ label, days }) => (
                <Button
                  key={days}
                  onClick={() => {
                    const base =
                      deadline && isValid(new Date(deadline))
                        ? new Date(deadline)
                        : new Date();
                    const newDeadline = addDays(base, days).toISOString();
                    setDeadline(newDeadline);
                    setDeadlineError(undefined);
                    setPickerKey((k) => k + 1);
                  }}
                  className="h-9 flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="mt-2 border-0 bg-transparent p-3">
            <Button
              variant="outline"
              className="cursor-pointer p-4"
              disabled={isExtendingDeadline}
              onClick={() => setDeadlineDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-blue-500 p-4 px-4 text-white hover:bg-blue-600"
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
