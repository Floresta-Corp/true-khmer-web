import { useState } from "react";
import { AlertTriangle, Flag, X } from "lucide-react";
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
import { Textarea } from "~/components/ui/textarea";

const REPORT_REASONS = [
  "Spam or misleading",
  "Harassment or hate speech",
  "Inappropriate content",
  "Self-promotion / Advertising",
  "Copyright violation",
  "Other",
] as const;

type ReportReason = (typeof REPORT_REASONS)[number];

interface ReportDialogProps {
  /** Title of the post/answer being reported — shown in the preview card */
  postTitle?: string;
  /** Called when the user submits the report */
  onSubmit?: (reason: ReportReason, details: string) => void;
}

export default function ReportDialog({
  postTitle,
  onSubmit,
}: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null,
  );
  const [details, setDetails] = useState("");

  function reset() {
    setSelectedReason(null);
    setDetails("");
  }

  function handleSubmit() {
    if (!selectedReason) return;
    onSubmit?.(selectedReason, details);
    setOpen(false);
    reset();
  }

  function handleCancel() {
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-[22.75px] w-[22.75px] rounded-[3.5px] p-[5.25px] text-[#99a1af] transition-colors hover:bg-transparent hover:text-[#e7000b]"
        >
          <Flag className="h-3 w-3" />
          <span className="sr-only">Report</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="gap-4 rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-lg min-w-lg"
      >
        {/* Close */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3.75 top-3.75 h-4 w-4 rounded-sm p-0 text-[#4a5565]/70 hover:bg-transparent hover:text-[#1f2937]"
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

        {/* Scrollable body */}
        <div className="flex max-h-[60dvh] flex-col gap-5 overflow-y-auto p-1">
          {/* Reporting post preview */}
          {postTitle && (
            <div className="flex flex-col gap-[3.5px] rounded-2xl border border-[#f3f4f6] bg-[#f8fafc] px-3 py-3">
              <p className="text-[12px] font-medium leading-4.5 text-[#99a1af]">
                Reporting Post:
              </p>
              <p className="text-[14px] font-normal leading-5.25 text-[#344256]">
                "{postTitle}"
              </p>
            </div>
          )}

          {/* Reason selector */}
          <div className="flex flex-col gap-3">
            <Label className="text-[14px] font-bold leading-5.25 text-[#344256]">
              Reason for Reporting
            </Label>
            <div className="flex flex-col gap-1.75">
              {REPORT_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`h-10.5 w-full rounded-2xl border px-3.5 text-left text-[13px] font-medium leading-[19.5px] transition-colors ${
                      isSelected
                        ? "border-[#ffc9c9] bg-[#fef2f2] text-[#e7000b]"
                        : "border-[#f3f4f6] bg-white text-[#4a5565] hover:border-[#ffc9c9] hover:bg-[#fef2f2] hover:text-[#e7000b]"
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional details */}
          <div className="flex flex-col gap-3">
            <Label className="text-[14px] leading-[21px] text-[#344256]">
              <span className="font-bold">Additional Details</span>{" "}
              <span className="font-normal italic text-[#9eacc0]">
                (optional)
              </span>
            </Label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us more about why you are reporting this..."
              rows={4}
              className="w-full rounded-2xl border-[#f1f5f9] bg-[#f8fafc] px-[14px] py-[10.5px] text-[14px] font-medium leading-[21px] text-[#344256] placeholder:font-medium placeholder:text-[#9eacc0] focus-visible:ring-[#e7000b]/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-8 rounded-lg border-[#e1e7ef] px-3 text-sm font-medium text-[#1d283a] hover:bg-[#f8fafc]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="h-8 rounded-lg bg-[#FB3748] px-3 text-sm font-medium text-white hover:bg-[#e7000b] disabled:opacity-50"
          >
            Submit report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
