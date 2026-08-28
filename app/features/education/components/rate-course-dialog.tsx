import { useState } from "react";
import { useFetcher } from "react-router";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

interface RateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
}

export function RateCourseDialog({
  open,
  onOpenChange,
  courseTitle,
}: RateCourseDialogProps) {
  const fetcher = useFetcher();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const isSubmitting = fetcher.state !== "idle";
  const highlighted = hovered || rating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] font-tk-edu">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1A1A2E]">
            How was {courseTitle}?
          </DialogTitle>
          <DialogDescription className="text-sm text-[#9A9AB0]">
            Your rating helps other learners find the right course.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form
          method="post"
          onSubmit={() => onOpenChange(false)}
          className="mt-2"
        >
          <input type="hidden" name="rating" value={rating} />

          <div
            className="mb-4.5 flex items-center gap-2"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((position) => (
              <button
                key={position}
                type="button"
                aria-label={`${position} star${position === 1 ? "" : "s"}`}
                aria-pressed={rating === position}
                onMouseEnter={() => setHovered(position)}
                onClick={() => setRating(position)}
                className="cursor-pointer p-0.5"
              >
                <Star
                  aria-hidden
                  className={cn(
                    "size-7 transition-colors",
                    position <= highlighted
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200",
                  )}
                />
              </button>
            ))}
          </div>

          <textarea
            name="comment"
            placeholder="Add a comment (optional)"
            maxLength={2000}
            className="mb-4.5 min-h-[70px] w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-[#333333] outline-none placeholder:text-[#9A9AB0] focus:border-[#1C5DD4]"
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 cursor-pointer rounded-lg bg-[#1C5DD4] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#174FB4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Submitting…" : "Submit rating"}
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="shrink-0 cursor-pointer px-2 py-3 text-[13px] font-medium text-[#9A9AB0] hover:text-[#333333]"
            >
              Skip
            </button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
