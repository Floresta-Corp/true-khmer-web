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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface DeleteForumQuestionDialogProps {
  questionId: string;
  questionTitle: string;
  onConfirm: (questionId: string) => void;
  disabled?: boolean;
  withLabel?: boolean;
}

export default function DeleteForumQuestionDialog({
  questionId,
  questionTitle,
  onConfirm,
  disabled = false,
  withLabel = false,
}: DeleteForumQuestionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm(questionId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {withLabel ? (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className="h-auto cursor-pointer gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
            aria-label={`Delete question: ${questionTitle}`}
          >
            <Trash2 size={14} />
            Delete question
          </Button>
        </DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  className="h-[26.25px] w-[26.25px] cursor-pointer rounded-xl bg-[#f9fafb] text-[#99a1af] transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  aria-label={`Delete question: ${questionTitle}`}
                >
                  <Trash2 size={12.25} />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete question</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>Delete this question?</DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          &ldquo;{questionTitle}&rdquo; will be removed from every forum listing
          and detail page. Its answers stay attached to the removed question.
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
