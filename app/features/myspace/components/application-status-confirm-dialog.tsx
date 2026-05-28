import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface ApplicationStatusConfirmDialogProps {
  action: "accept" | "decline";
  trigger: ReactNode;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function ApplicationStatusConfirmDialog({
  action,
  trigger,
  onConfirm,
  isSubmitting,
}: ApplicationStatusConfirmDialogProps) {
  const isDecline = action === "decline";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl">
        <DialogTitle>
          {isDecline ? "Decline Application" : "Confirm Participation"}
        </DialogTitle>
        <DialogDescription>
          {isDecline
            ? "Are you sure you want to decline this offer? This action cannot be undone."
            : "Are you sure you want to accept this position? This will confirm your participation in the project."}
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className={
              isDecline
                ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
                : "bg-[#2F6FE4] text-white hover:bg-[#245cc2] disabled:opacity-70"
            }
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting
              ? isDecline
                ? "Declining..."
                : "Confirming..."
              : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
