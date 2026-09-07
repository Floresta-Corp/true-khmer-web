import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

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

interface ApproveCourseDialogProps {
  courseId: string;
  courseTitle: string;
  onConfirm: (courseId: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function ApproveCourseDialog({
  courseId,
  courseTitle,
  onConfirm,
  disabled = false,
  className,
}: ApproveCourseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm(courseId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          className={cn(
            "h-auto cursor-pointer gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 dark:hover:bg-emerald-500",
            className,
          )}
          aria-label={`Approve course: ${courseTitle}`}
        >
          <CheckCircle2 size={14} />
          Approve
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>Approve this course?</DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          {`“${courseTitle}” is published to the Education Center as soon as you approve it, and its creator is notified. You can still unpublish it afterwards.`}
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
            className="bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500"
          >
            Approve and publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
