import { useState } from "react";
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
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { BLOG_COMMENT_ACTIONS } from "../../types";

interface DeleteBlogCommentDialogProps {
  commentId: string;
  /** Lowercase noun used in the copy, e.g. "comment" or "reply". */
  label: string;
  trigger: React.ReactNode;
}

export default function DeleteBlogCommentDialog({
  commentId,
  label,
  trigger,
}: DeleteBlogCommentDialogProps) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";
  const [open, setOpen] = useState(false);
  const Entity = label.charAt(0).toUpperCase() + label.slice(1);

  useFetcherOutcome(fetcher, {
    onSuccess: (message) => {
      setOpen(false);
      toast.success(message ?? `${Entity} deleted successfully.`);
    },
    onError: (message) =>
      toast.error(message ?? `Failed to delete ${label}.`),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogTitle>Delete {label}?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Your {label} will be permanently
          removed.
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
            onClick={() =>
              fetcher.submit(
                { actionType: BLOG_COMMENT_ACTIONS.delete, commentId },
                { method: "post" },
              )
            }
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
