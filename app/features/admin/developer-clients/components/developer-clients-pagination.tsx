import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import type { ListDeveloperClientsResponse } from "~/types/api-client";

export function DeveloperClientsPagination({
  meta,
}: {
  meta: ListDeveloperClientsResponse["meta"];
}) {
  const [, setSearchParams] = useSearchParams();
  const { page, pageSize, total, totalPages } = meta;
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

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
        clients
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          aria-label="Previous page"
          className="shadow-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
        >
          <ChevronLeft />
        </Button>
        <span className="min-w-24 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          aria-label="Next page"
          className="shadow-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
        >
          <ChevronRight />
        </Button>
      </div>
    </footer>
  );
}

export function DeveloperClientsPaginationSkeleton() {
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
