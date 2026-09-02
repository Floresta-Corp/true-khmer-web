import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { CourseReview } from "~/features/education/types";
import { CourseReviewRow } from "./course-review-row";
import { StarRating } from "./star-rating";

interface CourseReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: number;
  reviewCount: number;
  reviews: CourseReview[];
}

/**
 * Every review for a course, behind the detail screen's "Show all reviews".
 *
 * The design's own measurements: a 640px panel capped at 80vh, the score and
 * stars in a bordered header, and the list scrolling under it.
 */
export function CourseReviewsDialog({
  open,
  onOpenChange,
  rating,
  reviewCount,
  reviews,
}: CourseReviewsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 font-tk-edu sm:max-w-[640px]">
        <DialogHeader className="shrink-0 flex-row items-center gap-4 border-b border-[#E5E7EB] px-7 pt-6 pb-5">
          <span className="text-[32px] leading-none font-extrabold text-[#1A1A2E]">
            {rating.toFixed(1)}
          </span>
          <div>
            <StarRating value={rating} />
            <DialogTitle className="mt-1 text-xs font-normal text-[#9A9AB0]">
              {reviewCount.toLocaleString()} review
              {reviewCount === 1 ? "" : "s"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4.5 overflow-y-auto px-7 pt-6 pb-7">
          {reviews.map((review) => (
            <CourseReviewRow key={review.id} review={review} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
