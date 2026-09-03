import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

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
import { Textarea } from "~/components/ui/textarea";
import { REJECTION_NOTE_MAX_LENGTH } from "~/features/admin/manage-education/types";
import { cn } from "~/lib/utils";

interface RejectCourseDialogProps {
  courseId: string;
  courseTitle: string;
  onConfirm: (courseId: string, note: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function RejectCourseDialog({
  courseId,
  courseTitle,
  onConfirm,
  disabled = false,
  className,
}: RejectCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) setNote("");
  }, [open]);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm(courseId, note);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          className={cn(
            "h-auto cursor-pointer gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300",
            className,
          )}
          aria-label={`Reject course: ${courseTitle}`}
        >
          <XCircle size={14} />
          Reject
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>Reject this course?</DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          {`“${courseTitle}” goes back to its creator as a draft. They keep everything they have written and can resubmit once they have addressed your notes.`}
        </DialogDescription>

        <div className="space-y-2">
          <label
            htmlFor={`reject-note-${courseId}`}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            Reason
            <span className="font-normal text-slate-400 dark:text-slate-500">
              {" (optional)"}
            </span>
          </label>
          <Textarea
            id={`reject-note-${courseId}`}
            value={note}
            maxLength={REJECTION_NOTE_MAX_LENGTH}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Shown to the creator, e.g. lessons 3–5 have no video source."
            className="min-h-24 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <p className="text-right text-[11px] text-slate-400 dark:text-slate-500">
            {note.length}/{REJECTION_NOTE_MAX_LENGTH}
          </p>
        </div>

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
            Reject course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
