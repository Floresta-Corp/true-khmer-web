import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

/**
 * Confirms deleting a whole course. Worth a stop: it takes the curriculum, the
 * quiz and every learner's progress with it, and enrolled learners lose the
 * course from their classes.
 */
export function DeleteCourseDialog({
  open,
  courseTitle,
  learnerCount = 0,
  deleting,
  onConfirm,
  onClose,
}: {
  open: boolean;
  courseTitle: string;
  /** Omitted where the caller has no enrollment figure to warn about. */
  learnerCount?: number;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !next && !deleting && onClose()}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-bold text-[#1A1A2E]">
            Delete this course?
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[1.5] text-[#9A9AB0]">
            <strong className="font-semibold text-[#1A1A2E]">
              {courseTitle}
            </strong>{" "}
            and its curriculum, quiz and student progress are removed.
            {learnerCount > 0 && (
              <>
                {" "}
                {learnerCount.toLocaleString()} enrolled{" "}
                {learnerCount === 1 ? "learner" : "learners"} lose access.
              </>
            )}{" "}
            This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            disabled={deleting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            loading={deleting}
            onClick={onConfirm}
            className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
          >
            Delete course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
