import { X } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function AddAnswerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-lg border-[#e2e8f0] px-4 text-sm font-medium text-[#0f172b] shadow-xs"
        >
          Add your answer
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] gap-4 overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white p-6 sm:max-w-201"
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-4 right-4 h-4 w-4 rounded-sm p-0 text-[#4a5565]/80 hover:bg-transparent hover:text-[#1f2937]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <DialogTitle className="text-[34px] leading-7 font-semibold text-[#111827]">
          Your answer
        </DialogTitle>

        <textarea
          placeholder="Share your experience or provide advice..."
          className="h-20 w-full resize-none rounded-md border border-[#e2e8f0] bg-white px-3 py-2 text-sm leading-5 text-[#111827] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#2f6fe4]/20"
        />

        <div className="flex w-full justify-end">
          <Button className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]">
            Post answer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
