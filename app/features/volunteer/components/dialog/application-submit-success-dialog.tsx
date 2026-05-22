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
        className="sm:max-w-lg overflow-hidden rounded-2xl border-none bg-white p-0 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] [&>button]:hidden"
      >
        <div className="relative h-132.5 w-full">
          <button
            type="button"
            aria-label="Close dialog"
            className="absolute right-[35.02px] top-9.75 z-10 flex size-3.5 items-center justify-center text-[#94a3b8] transition-colors hover:text-[#64748b]"
            onClick={() => onOpenChange(false)}
          >
            <span className="text-[26px] leading-none">×</span>
          </button>

          <div className="absolute left-1/2 top-10 flex -translate-x-1/2 flex-col items-center pb-8">
            <div className="relative flex size-28 items-center justify-center rounded-full bg-[#F0FDF4] drop-shadow-[0px_0px_20px_rgba(34,197,94,0.4)]">
              <div className="absolute inset-4 rounded-full bg-[rgba(34,197,94,0.2)] blur-md" />
              <div className="relative flex size-20 items-center justify-center rounded-full bg-[#22C55E] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                <Check size={35} className="text-white" />
              </div>
            </div>
          </div>

          <div className="absolute left-10 right-10 top-46 flex flex-col items-center pb-6">
            <DialogTitle className="text-center font-['Inter'] text-[36px] font-bold leading-11.25 tracking-[-0.9px] text-[#0F172A]">
              Application Submitted!
            </DialogTitle>
          </div>

          <div className="absolute left-16 top-63.25 flex w-96 flex-col items-center pb-10">
            <DialogDescription className="w-full text-center font-['Inter'] text-[18px] font-medium leading-6.75 text-[#344256]">
              We’ve received your request for{" "}
              <span className="font-bold">{title}</span>. You can track your
              application status in your dashboard.
            </DialogDescription>
          </div>

          <div className="absolute left-10 right-10 top-[380.75px] flex flex-col gap-4">
            <Button
              type="button"
              className="h-15 w-full rounded-xl bg-[#1c5dd4] px-8 text-[18px] font-semibold text-white shadow-[0px_10px_15px_-3px_rgba(59,130,246,0.2),0px_4px_6px_-4px_rgba(59,130,246,0.2)] hover:bg-[#245fca]"
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
