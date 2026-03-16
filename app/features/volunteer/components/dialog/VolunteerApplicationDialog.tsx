import React from "react";
import { ChevronDown, FileText, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { VolunteerRole } from "~/lib/post";

interface VolunteerApplicationDialogProps {
  role: VolunteerRole;
  trigger?: React.ReactNode;
}

export default function VolunteerApplicationDialog({
  role,
  trigger,
}: VolunteerApplicationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="h-10 w-full bg-[#2f6fe4] text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
            Apply Now
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="min-w-lg rounded-[14px] border border-[#e1e7ef] p-0 [&>button]:right-6 [&>button]:top-5.5 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:text-[#99a1af] [&>button]:opacity-100">
        <div className="border-b border-[#f3f4f6] px-6 pb-3.75 pt-5 mb-6">
          <h2 className="text-[20px] font-semibold leading-[25.2px] text-[#030213]">
            Volunteer Application
          </h2>
        </div>

        <div className="space-y-5 px-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-3.5 rounded-[14px] border-[0.8px] border-[rgba(47,111,228,0.1)] bg-[#f0f6ff] px-[18.3px] py-[20.8px] mb-5">
            <div className="flex size-8.75 items-center justify-center rounded-2xl bg-[#2f6fe4]">
              <User className="size-6 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-[19.5px] text-[#2f6fe4]">
                Your True Khmer profile will be automatically shared
              </p>
              <p className="text-[11px] font-medium leading-[16.5px] text-[rgba(47,111,228,0.7)]">
                The project owner will see your profile, tier, and details.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-sm font-medium leading-5.25 text-[#65758b]">
              Which role are you applying for?
            </p>
            <div className="flex items-start justify-between rounded-lg bg-[#f8fafc] px-3 py-3">
              <p className="flex-1 text-sm font-semibold text-[#344256]">
                {role.title}
              </p>
              <ChevronDown className="size-3.5 text-[#99a1af]" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label
              htmlFor="availability"
              className="text-[13px] font-semibold leading-[19.5px] text-[#364153]"
            >
              Your Availability
            </label>
            <textarea
              id="availability"
              placeholder="e.g. Weekend only, 2-4 hours per week..."
              className="h-21 w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm font-medium text-[#364153] placeholder:text-[#65758b] focus-visible:border-[#2f6fe4] focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2 mb-5">
            <label
              htmlFor="experience"
              className="text-[13px] font-semibold leading-[19.5px] text-[#364153]"
            >
              Relevant Experience
            </label>
            <textarea
              id="experience"
              placeholder="Briefly describe your experience relevant to this role..."
              className="h-23.75 w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm font-medium text-[#364153] placeholder:text-[#65758b] focus-visible:border-[#2f6fe4] focus-visible:outline-none"
            />
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium leading-5.25 text-[#65758b]">
                Supporting Documents
              </p>
              <Button
                type="button"
                variant="ghost"
                className="text-sm font-semibold leading-4.5 text-[#2f6fe4]"
              >
                + Add
              </Button>
            </div>

            <div className="rounded-lg border border-[#f1f5f9] p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-6 text-[#2f6fe4]" />
                  <p className="text-xs font-medium leading-[19.5px] text-[#0a0a0a]">
                    Volunteer 2025 David
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-medium leading-[19.5px] text-[#65758b]"
                >
                  Replace
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-[10px] px-6 pb-6">
          <DialogClose asChild>
            <Button variant="outline" className="h-10 rounded-lg px-6 text-sm">
              Cancel
            </Button>
          </DialogClose>
          <Button className="h-10 rounded-lg bg-[#2f6fe4] px-6 text-sm text-[#f8fafc] hover:bg-[#245fca]">
            Submit Application
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
