import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Filter, Search, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BLOG_STATUS_LABELS, type BlogPostStatus } from "~/lib/blog-status";

interface BlogQueueFiltersProps {
  filters: {
    search?: string;
    status?: BlogPostStatus;
  };
}

export function BlogQueueFilters({ filters }: BlogQueueFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const hasFilters = Boolean(filters.search || filters.status);

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
      params.set("page", "1");
      setSearchParams(params, { replace: true, preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), {
      replace: true,
      preventScrollReset: true,
    });
    setSearchValue("");
  }, [setSearchParams]);

  useEffect(() => {
    if ((searchParams.get("search") ?? "") === searchValue) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchValue) params.set("search", searchValue);
      else params.delete("search");
      params.set("page", "1");
      setSearchParams(params, { replace: true, preventScrollReset: true });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchParams, searchValue, setSearchParams]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by title, excerpt, or author..."
              className="h-10 border-slate-200 bg-white pr-9 pl-9 dark:border-slate-700 dark:bg-slate-950/60"
            />
            {searchValue ? (
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => setSearchValue("")}
                aria-label="Clear search"
              >
                <X className="size-3.5 text-muted-foreground" />
              </Button>
            ) : null}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          className={`h-10 w-full rounded-lg border sm:w-auto ${
            hasFilters
              ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
          }`}
          onClick={() => setShowFilters((current) => !current)}
        >
          <Filter className="size-4" />
          Filters
        </Button>
      </div>

      {showFilters ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 sm:p-6 dark:bg-slate-950/60">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">Filter Options</h3>
            {hasFilters && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearFilters}
              >
                <X className="size-4" />
                Clear All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateQuery("status", value)}
            >
              <SelectTrigger className="h-10 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {(Object.keys(BLOG_STATUS_LABELS) as BlogPostStatus[]).map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {BLOG_STATUS_LABELS[status]}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
    </>
  );
}
