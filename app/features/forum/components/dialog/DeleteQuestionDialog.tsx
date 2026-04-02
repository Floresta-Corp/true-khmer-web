import { useFetcher } from "react-router";
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

interface DeleteQuestionDialogProps {
  questionId: string;
  trigger: React.ReactNode;
}

export default function DeleteQuestionDialog({
  questionId,
  trigger,
}: DeleteQuestionDialogProps) {
  const deleteFetcher = useFetcher();
  const isDeleting = deleteFetcher.state !== "idle";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogTitle>Delete question?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Your question will be permanently
          removed.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>

          <deleteFetcher.Form method="delete">
            <input type="hidden" name="questionId" value={questionId} />
            <Button type="submit" disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </deleteFetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
