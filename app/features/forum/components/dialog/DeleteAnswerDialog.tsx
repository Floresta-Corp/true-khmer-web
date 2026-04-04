import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
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
      const result = fetcher.data as
        | { ok?: boolean; message?: string; error?: string }
        | { data?: { ok?: boolean }; message?: string; error?: string };

      const isSuccess =
        ("ok" in result && result.ok === true) ||
        ("data" in result && result.data?.ok === true);

      if (isSuccess) {
        setOpen(false);
        toast.success("Answer deleted successfully!");
      } else {
        toast.error(
          result?.message ?? result?.error ?? "Failed to delete answer.",
        );
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-sm">
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

          <fetcher.Form method="post">
            <input type="hidden" name="actionType" value="delete-answer" />
            <input type="hidden" name="answerId" value={answerId} />
            <Button
              type="submit"
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
