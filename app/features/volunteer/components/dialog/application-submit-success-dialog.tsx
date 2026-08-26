import { Check } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";

interface ApplicationSubmitSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewPost?: () => void;
  applicationName?: string;
}

const DEFAULT_APPLICATION_NAME = "the selected opportunity";

export default function ApplicationSubmitSuccessDialog({
  open,
  onOpenChange,
  onViewPost,
  applicationName,
}: ApplicationSubmitSuccessDialogProps) {
  const title = applicationName?.trim() || DEFAULT_APPLICATION_NAME;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:max-w-lg [&>button]:hidden"
      >
        <div className="flex max-h-[90vh] flex-col items-center gap-6 overflow-y-auto px-6 py-10 sm:px-10 sm:py-12">
          <button
            type="button"
            aria-label="Close dialog"
            className="self-end text-[#94a3b8] transition-colors hover:text-[#64748b]"
            onClick={() => onOpenChange(false)}
          >
            <span className="text-[26px] leading-none">×</span>
          </button>

          <div className="flex flex-col items-center">
            <div className="relative flex size-28 items-center justify-center rounded-full bg-[#F0FDF4] drop-shadow-[0px_0px_20px_rgba(34,197,94,0.4)]">
              <div className="absolute inset-4 rounded-full bg-[rgba(34,197,94,0.2)] blur-md" />
              <div className="relative flex size-20 items-center justify-center rounded-full bg-[#22C55E] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                <Check size={35} className="text-white" />
              </div>
            </div>
          </div>

          <DialogTitle className="text-center font-['Inter'] text-[28px] leading-tight font-bold tracking-[-0.9px] text-[#0F172A] sm:text-[36px] sm:leading-11.25">
            Application Submitted!
          </DialogTitle>

          <DialogDescription className="w-full max-w-sm text-center font-['Inter'] text-[16px] leading-6.75 font-medium text-[#344256] sm:text-[18px]">
            We’ve received your request for{" "}
            <span className="font-bold">{title}</span>. You can track your
            application status in your dashboard.
          </DialogDescription>

          <div className="flex w-full flex-col gap-4">
            <Button
              type="button"
              className="h-15 w-full rounded-xl bg-[#1c5dd4] px-8 text-[16px] font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(59,130,246,0.2),0px_4px_6px_-4px_rgba(59,130,246,0.2)] hover:bg-[#245fca] sm:text-[18px]"
              onClick={() => {
                onOpenChange(false);
                onViewPost?.();
              }}
            >
              Go to application
            </Button>

            <Button asChild variant="ghost" className="rounded-xl px-3 py-2">
              <Link
                to="/volunteer"
                className="text-[16px] font-semibold text-[#1c5dd4] hover:bg-transparent hover:text-[#1c5dd4]"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Explore more opportunities
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
