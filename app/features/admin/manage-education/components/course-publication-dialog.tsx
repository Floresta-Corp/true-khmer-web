import { useState } from "react";
import { EyeOff, Undo2 } from "lucide-react";

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

interface CoursePublicationDialogProps {
  courseId: string;
  courseTitle: string;
  published: boolean;
  onPublish: (courseId: string) => void;
  onUnpublish: (courseId: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function CoursePublicationDialog({
  courseId,
  courseTitle,
  published,
  onPublish,
  onUnpublish,
  disabled = false,
  className,
}: CoursePublicationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    if (published) onUnpublish(courseId);
    else onPublish(courseId);
  };

  const actionLabel = published ? "Unpublish" : "Publish";
  const Icon = published ? EyeOff : Undo2;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          className={cn(
            "h-auto cursor-pointer gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold dark:bg-slate-900",
            published
              ? "border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300",
            className,
          )}
          aria-label={`${actionLabel} course: ${courseTitle}`}
        >
          <Icon size={14} />
          {actionLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>
          {published ? "Unpublish this course?" : "Publish this course again?"}
        </DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          {published
            ? `“${courseTitle}” disappears from the Education Center catalog and no one new can enrol. Learners already enrolled keep their progress, and you can publish it again at any time.`
            : `“${courseTitle}” returns to the Education Center catalog and can be enrolled in again.`}
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
            className={cn(
              "text-white",
              published
                ? "bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-500"
                : "bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500",
            )}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
