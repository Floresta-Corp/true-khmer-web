import { useState } from "react";
import { AlertTriangle, Flag, X } from "lucide-react";
import { Link, useFetcher, useLocation } from "react-router";
import { toast } from "sonner";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { AlertMessageDialog } from "~/features/forum/components/dialog/alert-message-dialog";
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
import { REPORT_DESCRIPTION_MAX_LENGTH } from "~/features/volunteer/types";

export interface VolunteerReportReasonData {
  id: string;
  reason: string;
}

interface VolunteerReportDialogProps {
  opportunityId: string;
  title?: string;
  isAuthenticated?: boolean;
  reportReasons: VolunteerReportReasonData[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function VolunteerReportDialog({
  opportunityId,
  title,
  isAuthenticated = false,
  reportReasons,
  open: controlledOpen,
  onOpenChange,
  trigger,
}: VolunteerReportDialogProps) {
  const location = useLocation();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fetcher = useFetcher();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  function setOpen(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function reset() {
    setSelectedReason(null);
    setDetails("");
  }

  function handleCancel() {
    setOpen(false);
    reset();
  }

  useFetcherOutcome(fetcher, {
    onSuccess: (message) => {
      setOpen(false);
      reset();
      toast.success(message ?? "Report submitted successfully.");
    },
    onError: (message) => {
      setErrorMessage(message ?? "Failed to submit report.");
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
        className="flex size-8 cursor-pointer items-center justify-center rounded-[3.5px] text-[#99a1af] transition-colors hover:bg-transparent hover:text-[#e7000b]"
      >
        <Flag className="h-3.5 w-3.5" />
        <span className="sr-only">Report</span>
      </Link>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        !isControlled && (
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer rounded-[3.5px] text-[#99a1af] transition-colors hover:bg-transparent hover:text-[#e7000b]"
            >
              <Flag className="h-3.5 w-3.5" />
              <span className="sr-only">Report</span>
            </Button>
          </DialogTrigger>
        )
      )}

      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-160 flex-col gap-4 overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-lg sm:p-6"
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3.75 right-3.75 h-4 w-4 cursor-pointer rounded-sm p-0 text-[#4a5565]/70 hover:bg-transparent hover:text-[#1f2937]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2]">
            <AlertTriangle className="h-[17.5px] w-[17.5px] text-[#e7000b]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-lg leading-7 font-semibold text-[#030213]">
              Report Opportunity
            </DialogTitle>
            <p className="text-sm leading-5 font-normal text-[#6a7282]">
              Help us keep the community professional
            </p>
          </div>
        </div>

        <Separator />

        <fetcher.Form method="post" className="flex min-h-0 flex-1 flex-col">
          <input type="hidden" name="actionType" value="report-opportunity" />
          <input type="hidden" name="opportunityId" value={opportunityId} />

          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-1 pb-4 sm:pb-5">
            {title && (
              <div className="flex flex-col gap-[3.5px] rounded-2xl border border-[#f3f4f6] bg-[#f8fafc] px-3 py-3">
                <p className="text-[12px] leading-4.5 font-medium text-[#99a1af]">
                  Reporting Opportunity:
                </p>
                <p className="line-clamp-6 text-[14px] leading-5.25 font-normal text-[#344256]">
                  &quot;{title}&quot;
                </p>
              </div>
            )}
            <fieldset className="min-w-0">
              <legend className="text-[14px] leading-5.25 font-bold text-[#344256]">
                Reason for Reporting
              </legend>
              <div className="mt-3 flex flex-col gap-1.75">
                {reportReasons?.map((v) => {
                  const isSelected = selectedReason === v.id;
                  return (
                    <label key={v.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="typeId"
                        value={v.id}
                        checked={isSelected}
                        onChange={() => setSelectedReason(v.id)}
                        className="peer sr-only"
                      />
                      <span
                        className={`flex h-10.5 w-full items-center rounded-2xl border px-3.5 text-[13px] leading-[19.5px] font-medium transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#e7000b]/40 ${
                          isSelected
                            ? "border-[#ffc9c9] bg-[#fef2f2] text-[#e7000b]"
                            : "border-[#f3f4f6] bg-white text-[#4a5565] hover:border-[#ffc9c9] hover:bg-[#fef2f2] hover:text-[#e7000b]"
                        }`}
                      >
                        {v.reason}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-3">
              <Label className="text-[14px] leading-5.25 text-[#344256]">
                <span className="font-bold">Additional Details</span>{" "}
                <span className="font-normal text-[#9eacc0] italic">
                  (optional)
                </span>
              </Label>
              <Textarea
                name="description"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us more about why you are reporting this..."
                rows={4}
                maxLength={REPORT_DESCRIPTION_MAX_LENGTH}
                className="w-full rounded-2xl border-[#f1f5f9] bg-[#f8fafc] px-3.5 py-[10.5px] text-[14px] leading-5.25 font-medium text-[#344256] placeholder:font-medium placeholder:text-[#9eacc0] focus-visible:ring-[#e7000b]/20"
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

      <AlertMessageDialog
        open={!!errorMessage}
        onOpenChange={(next) => {
          if (!next) setErrorMessage(null);
        }}
        title="Unable to Submit Report"
        description={errorMessage ?? undefined}
        onConfirm={() => setErrorMessage(null)}
      />
    </Dialog>
  );
}
