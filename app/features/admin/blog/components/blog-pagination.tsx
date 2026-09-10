import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { ListModerationBlogPostsResponse } from "~/types/api-client";

interface BlogPaginationProps {
  meta: ListModerationBlogPostsResponse["meta"];
  onPageChange: (page: number) => void;
  /** Noun used in the "Showing 1–6 of 32 …" summary. */
  label?: string;
}

export function BlogPagination({
  meta,
  onPageChange,
  label = "posts",
}: BlogPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 pb-2 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {(meta.page - 1) * meta.pageSize + 1}&ndash;
          {Math.min(meta.page * meta.pageSize, meta.total)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {meta.total.toLocaleString()}
        </span>{" "}
        {label}
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          aria-label="Previous page"
          className="shadow-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-24 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          Page {meta.page} of {Math.max(meta.totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          aria-label="Next page"
          className="shadow-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
