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

interface MarkBestAnswerDialogProps {
  answerId: string;

  trigger: React.ReactNode;
}

export default function MarkBestAnswerDialog({
  answerId,

  trigger,
}: MarkBestAnswerDialogProps) {
  const fetcher = useFetcher();
  const isMarking = fetcher.state !== "idle";
  const wasMarking = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasMarking.current = true;
    }

    if (wasMarking.current && fetcher.state === "idle" && fetcher.data) {
      wasMarking.current = false;
      const result = fetcher.data as
        | { ok?: boolean; message?: string; error?: string }
        | { data?: { ok?: boolean }; message?: string; error?: string };

      const isSuccess =
        ("ok" in result && result.ok === true) ||
        ("data" in result && result.data?.ok === true);

      if (isSuccess) {
        setOpen(false);
        toast.success("Marked as best answer!");
      } else {
        toast.error(
          result?.message ?? result?.error ?? "Failed to mark as best answer.",
        );
      }
    }
  }, [fetcher.state, fetcher.data]);

  const handleMark = () => {
    fetcher.submit(
      { actionType: "mark-as-best-answer", answerId },
      { method: "post" },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogTitle>Mark as best answer?</DialogTitle>
        <DialogDescription>
          This answer will be highlighted as the best solution to your question.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isMarking}>
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="default"
            disabled={isMarking}
            onClick={handleMark}
          >
            {isMarking ? "Marking..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
