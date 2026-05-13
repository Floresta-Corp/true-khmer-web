import React, { useEffect, useRef, useState } from "react";
import { useFetcher, Form } from "react-router";
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

  const handleDelete = () => {
    fetcher.submit(
      { actionType: "delete-answer", answerId },
      { method: "post" },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>

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
