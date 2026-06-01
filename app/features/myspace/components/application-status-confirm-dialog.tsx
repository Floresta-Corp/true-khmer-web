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
  action: "accept" | "decline" | "withdraw";
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
  const isWithdraw = action === "withdraw";
  const title = isWithdraw
    ? "Withdraw Application"
    : isDecline
      ? "Decline Application"
      : "Confirm Participation";
  const description = isWithdraw
    ? "Are you sure you want to withdraw this application?"
    : isDecline
      ? "Are you sure you want to decline this offer? This action cannot be undone."
      : "Are you sure you want to accept this position? This will confirm your participation in the project.";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogTitle className="text-xl font-bold text-[#202124] dark:text-white">
          {title}
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-6 text-[#5F6368] dark:text-slate-400">
          {description}
        </DialogDescription>

        <DialogFooter className="mt-6 gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="h-11 rounded-xl px-5 text-sm font-bold"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className={`h-11 rounded-xl px-6 text-sm font-bold text-white disabled:opacity-70 ${
              isDecline || isWithdraw
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#1A73E8] hover:bg-[#1557B0]"
            }`}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting
              ? isWithdraw
                ? "Withdrawing..."
                : isDecline
                ? "Declining..."
                : "Confirming..."
              : isWithdraw
                ? "Withdraw"
                : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
