import { useState } from "react";
import { AlertTriangle, Flag, X } from "lucide-react";
import { Link, useFetcher, useLocation } from "react-router";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Spinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";

export interface ReportReasonData {
  id: string;
  reason: string;
}

export enum ReportDialogType {
  QUESTION = "question",
  ANSWER = "answer",
}

interface ForumReportDialogProps {
  /** Title of the post/answer being reported — shown in the preview card */
  title?: string;
  isAuthenticated?: boolean;
  reportReasons: ReportReasonData[];
  type: ReportDialogType;
  id: string;
  trigger?: React.ReactNode;
}

export default function ForumReportDialog({
  title,
  isAuthenticated = false,
  reportReasons,
  type,
  id,
  trigger,
}: ForumReportDialogProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const fetcher = useFetcher();

  function reset() {
    setSelectedReason(null);
    setDetails("");
  }

  function handleCancel() {
    setOpen(false);
    reset();
  }

  useFetcherOutcome(fetcher, {
    onSuccess: () => {
      setOpen(false);
      reset();
    },
  });

  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
  const isSubmitting = fetcher.state === "submitting";

  if (!isAuthenticated) {
    if (trigger) {
      return <Link to={loginHref}>{trigger}</Link>;
    }

    return (
      <Link
        to={loginHref}
        className="cursor-pointer h-[22.75px] w-[22.75px] rounded-[3.5px] p-[5.25px] text-[#99a1af] transition-colors hover:bg-transparent hover:text-[#e7000b]"
      >
        <Flag className="h-3 w-3" />
        <span className="sr-only">Report</span>
      </Link>
    );
  }

  const isAnswer = type === ReportDialogType.ANSWER;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-[22.75px] w-[22.75px] rounded-[3.5px] p-[5.25px] text-[#99a1af] transition-colors hover:bg-transparent hover:text-[#e7000b]"
          >
            <Flag className="h-3 w-3" />
            <span className="sr-only">Report</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-160 flex-col gap-4 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-lg sm:p-6"
      >
        {/* Close */}
        <DialogClose>
          <Button
            variant="ghost"
            size="icon"
            className="absolute cursor-pointer right-3.75 top-3.75 h-4 w-4 rounded-sm p-0 text-[#4a5565]/70 hover:bg-transparent hover:text-[#1f2937]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2]">
            <AlertTriangle className="h-[17.5px] w-[17.5px] text-[#e7000b]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-lg font-semibold leading-7 text-[#030213]">
              Report Discussion
            </DialogTitle>
            <p className="text-sm font-normal leading-5 text-[#6a7282]">
              Help us keep the community professional
            </p>
          </div>
        </div>

        <Separator />

        <fetcher.Form method="post" className="flex min-h-0 flex-1 flex-col">
          <input
            hidden
            name="actionType"
            value={
              type === ReportDialogType.ANSWER
                ? "report-answer"
                : "report-question"
            }
          />
          <input
            hidden
            name={isAnswer ? "answerId" : "questionId"}
            value={id}
          />
          <input hidden name="typeId" value={selectedReason || ""} />
          {/* Scrollable body */}
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-1 pb-4 sm:pb-5">
            {/* Reporting post preview */}
            {title && (
              <div className="flex flex-col gap-[3.5px] rounded-2xl border border-[#f3f4f6] bg-[#f8fafc] px-3 py-3">
                <p className="text-[12px] font-medium leading-4.5 text-[#99a1af]">
                  Reporting Post:
                </p>
                <p className="text-[14px] font-normal leading-5.25 text-[#344256] line-clamp-6">
                  "{title}"
                </p>
              </div>
            )}

            {/* Reason selector */}
            <div className="flex flex-col gap-3">
              <Label className="text-[14px] font-bold leading-5.25 text-[#344256]">
                Reason for Reporting
              </Label>
              <div className="flex flex-col gap-1.75">
                {reportReasons &&
                  reportReasons.map((v) => {
                    const isSelected = selectedReason === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedReason(v.id)}
                        className={`h-10.5 cursor-pointer w-full rounded-2xl border px-3.5 text-[13px] content-center font-medium leading-[19.5px] transition-colors ${
                          isSelected
                            ? "border-[#ffc9c9] bg-[#fef2f2] text-[#e7000b]"
                            : "border-[#f3f4f6] bg-white text-[#4a5565] hover:border-[#ffc9c9] hover:bg-[#fef2f2] hover:text-[#e7000b]"
                        }`}
                      >
                        {v.reason}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Additional details */}
            <div className="flex flex-col gap-3">
              <Label className="text-[14px] leading-5.25 text-[#344256]">
                <span className="font-bold">Additional Details</span>{" "}
                <span className="font-normal italic text-[#9eacc0]">
                  (optional)
                </span>
              </Label>
              <Textarea
                name="description"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us more about why you are reporting this..."
                rows={4}
                className="w-full rounded-2xl border-[#f1f5f9] bg-[#f8fafc] px-3.5 py-[10.5px] text-[14px] font-medium leading-5.25 text-[#344256] placeholder:font-medium placeholder:text-[#9eacc0] focus-visible:ring-[#e7000b]/20"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 flex flex-col-reverse gap-2 sm:mt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-9 w-full rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a] hover:bg-[#f8fafc] sm:h-8 sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedReason || isSubmitting}
              className="h-9 w-full rounded-lg bg-[#FB3748] px-3 text-sm font-medium text-white hover:bg-[#e7000b] disabled:opacity-50 sm:h-8 sm:w-auto"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-1.5">
                  <Spinner className="size-3.5" />
                  Submitting...
                </span>
              ) : (
                "Submit report"
              )}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
