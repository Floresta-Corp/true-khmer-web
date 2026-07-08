import { AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

interface AlertMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export function AlertMessageDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "OK",
  onConfirm,
}: AlertMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-100 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-lg sm:p-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2]">
            <AlertTriangle className="h-[17.5px] w-[17.5px] text-[#e7000b]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-lg leading-7 font-semibold text-[#030213]">
              {title}
            </DialogTitle>
            {description && (
              <p className="text-sm leading-5 font-normal text-[#6a7282]">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
            className="h-9 rounded-lg bg-[#FB3748] px-4 text-sm font-medium text-white hover:bg-[#e7000b] sm:h-8"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
