import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/components/ui/dialog";
import type { EventSummary } from "../types";

interface Props {
  event?: EventSummary;
  onClose: () => void;
}

export default function TicketLoadingModal({ event, onClose }: Props) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-2xl bg-white p-8 text-[#111928] shadow-xl ring-1 ring-[#e2e8f0] sm:max-w-[320px]"
      >
        <div role="status" className="flex flex-col items-center gap-4">
          <Loader2
            size={28}
            className="text-[#2443ff] motion-safe:animate-spin"
            aria-hidden="true"
          />
          <DialogTitle className="text-sm font-medium text-[#475467]">
            Loading tickets…
          </DialogTitle>
          <DialogDescription className="sr-only">
            {event
              ? `Getting your tickets for ${event.title} ready to view.`
              : "Getting your ticket details ready to view."}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
