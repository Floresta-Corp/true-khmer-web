import type { PropsWithChildren } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "~/components/ui/dialog";

export function Modal({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => void }>) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-auto max-h-[85dvh] w-full flex-col gap-0 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-0 sm:max-w-4xl md:flex-row"
      >
        <DialogTitle className="sr-only">Your event tickets</DialogTitle>
        <DialogDescription className="sr-only">
          View ticket QR codes, event details, download tickets, or review your
          payment summary.
        </DialogDescription>
        <DialogClose className="absolute top-3 right-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#f3f4f6] text-[#667085] transition-colors hover:bg-[#2443ff]/10 hover:text-[#2443ff] sm:top-5 sm:right-5">
          <X size={18} />
          <span className="sr-only">Close tickets</span>
        </DialogClose>
        {children}
      </DialogContent>
    </Dialog>
  );
}
