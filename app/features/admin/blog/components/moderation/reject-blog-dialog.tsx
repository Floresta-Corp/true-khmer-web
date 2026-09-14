import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

interface RejectBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectBlogDialog({
  isOpen,
  onClose,
  onConfirm,
}: RejectBlogDialogProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Tell the author what needs to change.");
      return;
    }
    setError(null);
    onConfirm(trimmed);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:ring-slate-800">
        <DialogHeader>
          <DialogTitle className="text-rose-600 dark:text-rose-400">
            Reject submission
          </DialogTitle>
          <DialogDescription>
            The author sees this reason on their blog and can edit and submit it
            again.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          maxLength={1000}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            setReason(event.target.value);
            if (event.target.value.trim()) setError(null);
          }}
          placeholder="What needs to change before this can be published?"
          className="min-h-28 resize-none aria-invalid:border-rose-500"
        />
        {error ? <p className="text-xs text-rose-600">{error}</p> : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-rose-600 text-white hover:bg-rose-700"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
