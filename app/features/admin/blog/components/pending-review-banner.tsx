import { Link } from "react-router";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { Button } from "~/components/ui/button";

/**
 * Shown on the blog library page when authors have submissions waiting. The
 * submissions themselves live on the dedicated review queue.
 */
export function PendingReviewBanner({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-amber-900/60 dark:bg-amber-950/40">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
          <ClipboardCheck className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            Action required
          </p>
          <p className="mt-0.5 text-sm leading-6 text-amber-800 dark:text-amber-300/90">
            {count === 1
              ? "1 post is waiting for your review."
              : `${count.toLocaleString()} posts are waiting for your review.`}
          </p>
        </div>
      </div>

      <Button
        asChild
        className="shrink-0 rounded-lg bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:text-white dark:hover:bg-amber-500"
      >
        <Link to="/tk-admin/khmer-voices/review">
          Review submissions
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
