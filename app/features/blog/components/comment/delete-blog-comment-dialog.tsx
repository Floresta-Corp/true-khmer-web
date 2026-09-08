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
} from "~/components/ui/dialog";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { BLOG_COMMENT_ACTIONS } from "../../types";

interface DeleteBlogCommentDialogProps {
  commentId: string;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteBlogCommentDialog({
  commentId,
  label,
  open,
  onOpenChange,
}: DeleteBlogCommentDialogProps) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  useFetcherOutcome(fetcher, {
    onSuccess: (message) => {
      onOpenChange(false);
      toast.success(message ?? `${label} deleted.`);
    },
    onError: (message) => toast.error(message ?? `Failed to delete ${label}.`),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
