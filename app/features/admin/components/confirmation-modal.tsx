import { Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type ConfirmationVariant = "error" | "warning" | "info";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  loading?: boolean;
}

const titleColor: Record<ConfirmationVariant, string> = {
  error: "text-rose-600 dark:text-rose-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-blue-600 dark:text-blue-400",
};

const confirmButtonClass: Record<ConfirmationVariant, string> = {
  error:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500/30",
  warning:
    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500/30",
  info: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500/30",
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "error",
  loading = false,
}: ConfirmationModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={titleColor[variant]}>{title}</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-300">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="default"
            className={`flex-1 ${confirmButtonClass[variant]}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
