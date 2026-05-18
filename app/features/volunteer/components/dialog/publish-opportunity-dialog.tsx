import { Check } from "lucide-react";
import { Link } from "react-router";
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
      <DialogContent className="rounded-[14px] border-[0.8px] border-[#d0fae5] p-10 shadow-none w-[600px]">
        <div className="flex flex-col justify-center gap-5">
          <div className="mx-auto">
            <div className="border border-[#d0fae5] p-4 rounded-full bg-[#F0FDF4] shadow-[0_0_40px_0_rgba(34,197,94,0.40)]">
              <div className="flex items-center justify-center rounded-full bg-[#22C55E] size-20">
                <Check size={35} className="text-white" />
              </div>
            </div>
          </div>

          <div className="max-w-100 mb-3">
            <DialogTitle className="mb-6 text-[#0F172A] text-center font-['Inter'] text-[36px] font-bold leading-[45px] tracking-[-0.9px]">
              Your Opportunity is Now Live!
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-center font-['Inter'] text-[18px] font-medium leading-[27px]">
              Your post is public. You can manage applicants and edit your post
              details directly from your dashboard.
            </DialogDescription>
          </div>
          <div className="w-full space-y-2">
            <Button
              type="button"
              className="h-12 w-full rounded-xl bg-[#2f6fe4] text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]"
              onClick={() => {
                onOpenChange(false);
                onViewPost?.();
              }}
            >
              View My Post
            </Button>
            <Link to={"/volunteer"}>
              <Button
                type="button"
                variant="link"
                className="h-12 w-full  text-sm font-semibold  text-blue-600 "
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Explore More Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
