import { CircleCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";

interface PublishOpportunitySuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewPost?: () => void;
}

export default function PublishOpportunitySuccessDialog({
  open,
  onOpenChange,
  onViewPost,
}: PublishOpportunitySuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[320px] gap-5 rounded-[14px] border-[0.8px] border-[#d0fae5] bg-[#ecfdf5] px-4.25 py-5.5 shadow-none [&>button]:right-3.25 [&>button]:top-3.25 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:text-[#99a1af] [&>button]:opacity-100 [&>button]:hover:bg-transparent [&>button]:hover:text-[#99a1af]">
        <div className="mb-5 mx-auto flex size-14 items-center justify-center rounded-full bg-[#00bc7d] shadow-[0px_10px_15px_0px_rgba(0,188,125,0.2),0px_4px_6px_0px_rgba(0,188,125,0.2)]">
          <CircleCheck className="size-7 text-white" />
        </div>

        <div className="mb-5 space-y-3">
          <DialogTitle className="mb-3 text-center text-[18px] font-bold leading-6.75 text-[#1fc16b]">
            Your Opportunity is Now Live!
          </DialogTitle>
          <DialogDescription className="mx-auto max-w-57 text-center text-sm font-medium leading-[21.125px] text-[#007a55]">
            Your post is live on True Khmer. Passionate volunteers are already
            out there. We&apos;ll notify you when someone applies.
          </DialogDescription>
        </div>
        <div className="w-full">
          <Button
            type="button"
            className="h-10 w-full rounded-md bg-[#2f6fe4] text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]"
            onClick={() => {
              onOpenChange(false);
              onViewPost?.();
            }}
          >
            View My Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
