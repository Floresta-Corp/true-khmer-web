import { FileUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";

interface VolunteerApplicationModalProps {
  title: string;
}

export default function VolunteerApplicationModal({
  title,
}: VolunteerApplicationModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-10 w-full bg-[#2f6fe4] text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
          Apply Now
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[560px] rounded-[14px] border border-[#e1e7ef] p-0 [&>button]:right-6 [&>button]:top-[22px] [&>button]:rounded-full [&>button]:p-1.5 [&>button]:text-[#99a1af] [&>button]:opacity-100">
        <div className="border-b border-[#f3f4f6] px-6 pb-[15px] pt-5">
          <h2 className="text-[20px] font-semibold leading-[25.2px] text-[#030213]">
            Volunteer Application
          </h2>
          <p className="mt-1 text-[13px] font-medium leading-[19.5px] text-[#99a1af]">
            Applying for: <span className="text-[#2f6fe4]">{title}</span>
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="space-y-2">
            <label
              htmlFor="availability"
              className="text-[13px] font-semibold leading-[19.5px] text-[#364153]"
            >
              Your Availability
            </label>
            <textarea
              id="availability"
              placeholder="e.g. Weekend only, 2-4 hours per week..."
              className="h-[84px] w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm font-medium text-[#364153] placeholder:text-[#65758b] focus-visible:border-[#2f6fe4] focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="experience"
              className="text-[13px] font-semibold leading-[19.5px] text-[#364153]"
            >
              Relevant Experience
            </label>
            <textarea
              id="experience"
              placeholder="Briefly description your experience relevant to this role..."
              className="h-[95px] w-full resize-none rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-sm font-medium text-[#364153] placeholder:text-[#65758b] focus-visible:border-[#2f6fe4] focus-visible:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold leading-[19.5px] text-[#364153]">
              Supporting Documents
            </label>
            <label className="flex h-[145px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent bg-[#f8fafc] px-3 py-3 text-center">
              <input type="file" className="sr-only" />
              <FileUp className="size-[34px] text-[#c5ced8]" />
              <p className="mt-[11px] text-[13px] font-medium leading-[19.5px] text-[#6a7282]">
                Upload CV, Portfolio, or Resume
              </p>
              <p className="text-[11px] leading-[16.5px] text-[#99a1af]">
                PDF, DOC, or JPG up to 10MB
              </p>
            </label>
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
