import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { cn } from "~/lib/utils";

interface DeleteForumAnswerDialogProps {
  answerId: string;
  authorName: string;
  isReply?: boolean;
  replyCount?: number;
  onConfirm: (answerId: string, isReply: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function DeleteForumAnswerDialog({
  answerId,
  authorName,
  isReply = false,
  replyCount = 0,
  onConfirm,
  disabled = false,
  className,
}: DeleteForumAnswerDialogProps) {
  const [open, setOpen] = useState(false);
  const label = isReply ? "reply" : "answer";

  const handleConfirm = () => {
    setOpen(false);
    onConfirm(answerId, isReply);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className={cn(
            "size-8 shrink-0 cursor-pointer rounded-xl bg-[#f9fafb] text-[#99a1af] transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400",
            className,
          )}
          aria-label={`Delete ${label} by ${authorName}`}
        >
          <Trash2 size={14} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>Delete this {label}?</DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          {authorName}&rsquo;s {label} will be removed from the thread.
          {!isReply && replyCount > 0
            ? ` Its ${replyCount} ${replyCount === 1 ? "reply" : "replies"} will be removed too.`
            : ""}{" "}
          This cannot be undone from the panel.
        </DialogDescription>

        <DialogFooter className="dark:border-slate-700 dark:bg-slate-800/40">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
