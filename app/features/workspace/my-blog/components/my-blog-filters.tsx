import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { BLOG_STATUS_LABELS } from "~/lib/blog-status";
import type { MyBlogPostStatus } from "../types";

const STATUS_OPTIONS = Object.keys(BLOG_STATUS_LABELS) as MyBlogPostStatus[];

interface MyBlogFiltersProps {
  search?: string;
  status?: MyBlogPostStatus;
}

export function MyBlogFilters({ search, status }: MyBlogFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(search ?? "");

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

  function updateStatus(value: string) {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "all") params.delete("status");
    else params.set("status", value);
    params.set("page", "1");
    setSearchParams(params, { replace: true, preventScrollReset: true });
  }

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:p-6">
        <div className="min-w-0 flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by title or excerpt..."
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
        <Select value={status || "all"} onValueChange={updateStatus}>
          <SelectTrigger className="h-10 border-slate-200 bg-white sm:w-52 dark:border-slate-700 dark:bg-slate-900">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {BLOG_STATUS_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
