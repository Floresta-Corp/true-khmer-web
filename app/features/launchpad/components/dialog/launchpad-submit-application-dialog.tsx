import type { ReactNode } from "react";
import { ChevronDown, FileText, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

interface LaunchpadSubmitApplicationDialogProps {
  trigger: ReactNode;
  selectedRoleId?: string;
  roles?: Array<{ id: string; title: string }>;
}

export default function LaunchpadSubmitApplicationDialog({
  trigger,
  selectedRoleId,
  roles = [],
}: LaunchpadSubmitApplicationDialogProps) {
  const selectedRole = roles.find((role) => role.id === selectedRoleId);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-140 gap-4 rounded-lg border border-[#E2E8F0] p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.10),0px_4px_6px_-2px_rgba(0,0,0,0.05)] sm:max-w-140 [&>button]:right-3.75 [&>button]:top-3.75 [&>button]:size-4 [&>button]:rounded-full [&>button]:p-0 [&>button]:text-[#65758B] [&>button_svg]:size-4">
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-semibold text-[#0F1729]">
            Volunteer Application
          </DialogTitle>
        </DialogHeader>

        <Separator className="bg-[#E1E7EF]" />

        <div className="flex items-center gap-3.5 rounded-[14px] border-[0.8px] border-[rgba(47,111,228,0.10)] bg-[#F0F6FF] px-4.5 py-[20.8px]">
          <div className="flex size-8.75 items-center justify-center rounded-2xl bg-[#2F6FE4] text-white">
            <User className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-[19.5px] font-bold text-[#2F6FE4]">
              Your True Khmer profile will be automatically shared
            </p>
            <p className="text-[11px] leading-[16.5px] font-medium text-[rgba(47,111,228,0.70)]">
              The project owner will see your profile, tier, and details.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <p className="text-xs leading-4.5 font-medium text-[#364153]">
              Which role are you applying for?
            </p>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-between rounded-lg bg-[#F8FAFC] px-3"
            >
              <span className="text-sm font-semibold text-[#344256]">
                {selectedRole?.title || "Select a role"}
              </span>
              <ChevronDown className="size-3.5 text-[#344256]" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs leading-4.5 font-medium text-[#364153]">
              Your Availability
            </p>
            <Input
              placeholder="e.g. Weekend only, 2-4 hours per week..."
              className="h-11 border-0 bg-[#F8FAFC] px-3 text-xs text-[#344256] placeholder:text-xs placeholder:text-[#9EACC0]"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs leading-4.5 font-medium text-[#364153]">
              Relevant Experience
            </p>
            <Input
              placeholder="Briefly description your experience relevant to this role..."
              className="h-11 border-0 bg-[#F8FAFC] px-3 text-xs text-[#344256] placeholder:text-xs placeholder:text-[#9EACC0]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <p className="text-xs leading-4.5 font-medium text-[#364153]">
                Supporting Documents
              </p>
              <button
                type="button"
                className="text-xs leading-4.5 font-semibold text-[#2F6FE4]"
              >
                + Add
              </button>
            </div>
            <div className="rounded-lg border border-[#F1F5F9] p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-6 text-[#344256]" />
                  <p className="text-xs leading-3.75 text-[#0A0A0A]">
                    Volunteer 2025 David
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs leading-[19.5px] font-medium text-[#65758B]"
                >
                  Replace
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="mx-0 mb-0 mt-4 border-0 bg-transparent p-0 sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg border-[#E1E7EF] px-6 text-sm font-medium text-[#1D283A]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled
              className="h-10 rounded-lg bg-[#2F6FE4] px-6 text-sm font-medium text-white opacity-50"
            >
              Submit application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
