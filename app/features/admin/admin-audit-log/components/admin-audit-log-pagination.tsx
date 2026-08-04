import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

type AdminAuditLogPaginationProps = {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export function AdminAuditLogPagination({
  page,
  limit,
  totalPages,
  total,
}: AdminAuditLogPaginationProps) {
  const [, setSearchParams] = useSearchParams();
  // A hand-edited `?page=` can exceed the real page count; clamp so the controls
  // stay usable instead of stranding the admin past the end of the results.
  const lastPage = Math.max(totalPages, 1);
  const currentPage = Math.min(Math.max(page, 1), lastPage);
  const firstItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const lastItem = Math.min(currentPage * limit, total);

  function goToPage(nextPage: number) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("page", String(nextPage));
      return next;
    });
  }

  return (
    <footer className="mt-auto flex shrink-0 flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {firstItem}–{lastItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {total.toLocaleString()}
        </span>{" "}
        entries
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          aria-label="Previous page"
          className="shadow-none"
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-24 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          Page {currentPage} of {lastPage}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={currentPage >= lastPage}
          onClick={() => goToPage(currentPage + 1)}
          aria-label="Next page"
          className="shadow-none"
        >
          <ChevronRight />
        </Button>
      </div>
    </footer>
  );
}

export function AdminAuditLogPaginationSkeleton() {
  return (
    <footer className="mt-auto flex shrink-0 flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
      <Skeleton className="h-4 w-44 rounded" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 rounded-lg" />
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
    </footer>
  );
}
