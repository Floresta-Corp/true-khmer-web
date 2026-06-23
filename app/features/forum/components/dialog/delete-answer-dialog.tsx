import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { readActionResult } from "~/lib/action-result";
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

interface DeleteAnswerDialogProps {
  answerId: string;
  trigger: React.ReactNode;
}

export default function DeleteAnswerDialog({
  answerId,
  trigger,
}: DeleteAnswerDialogProps) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";
  const wasDeleting = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasDeleting.current = true;
    }

    if (wasDeleting.current && fetcher.state === "idle" && fetcher.data) {
      wasDeleting.current = false;
      const { ok, message } = readActionResult(fetcher.data);

      if (ok) {
        setOpen(false);
        toast.success(message ?? "Answer deleted successfully.");
      } else {
        toast.error(message ?? "Failed to delete answer.");
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleDelete = () => {
    fetcher.submit(
      { actionType: "delete-answer", answerId },
      { method: "post" },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogTitle>Delete answer?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Your answer will be permanently removed.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
