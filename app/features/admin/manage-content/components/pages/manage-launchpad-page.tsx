import { Suspense, useCallback, useMemo, useState } from "react";
import {
  Await,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";

import { Skeleton } from "~/components/ui/skeleton";
import ContentLoadError, {
  ContentCountUnavailable,
} from "~/features/admin/components/content-load-error";
import { cn } from "~/lib/utils";
import type { manageLaunchpadLoader } from "../../services/manage-launchpad.loader";
import { ALL_CATEGORIES } from "../../types";
import { ManageLaunchpadCardsSkeleton } from "../launchpad/manage-launchpad-page-skeleton";
import ManageLaunchpadProjects, {
  BASE_PATH,
  FILTER_KEYS,
  filterKeyOf,
  type ListStats,
} from "../launchpad/manage-launchpad-projects";
import {
  ALL_CITIES,
  ManageLaunchpadToolbar,
  readLaunchpadFilters,
} from "../launchpad/manage-launchpad-toolbar";

const ALL_STATUSES = "all-statuses";

export default function ManageLaunchpadPage() {
  const { data, categories, cities } =
    useLoaderData<typeof manageLaunchpadLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const [stats, setStats] = useState<ListStats | null>(null);

  const { categoryId: activeCategory, cityId: activeCity } =
    readLaunchpadFilters(searchParams);
  const activeStatus = searchParams.get("status") || ALL_STATUSES;
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  // The chip row leads with an "all" pseudo-category whose count is the sum of
  // the rest, matching the forum toolbar.
  const categoryOptions = useMemo(
    () => [
      {
        id: ALL_CATEGORIES,
        name: "All Categories",
        count: categories.reduce(
          (total, category) => total + (category.totalLaunchpad || 0),
          0,
        ),
      },
      ...categories.map((category) => ({
        id: category.id,
        name: category.name,
        count: category.totalLaunchpad ?? 0,
      })),
    ],
    [categories],
  );

  const updateFilter = useCallback(
    (key: (typeof FILTER_KEYS)[number], value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          // A filter change restarts the list, so the old cursor is invalid.
          next.delete("cursor");
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  // Typing shouldn't stack history entries, so search replaces the URL rather
  // than pushing to it.
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      const next = new URLSearchParams(searchParams);
      if (value) next.set("search", value);
      else next.delete("search");
      next.delete("cursor");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleStatusChange = useCallback(
    (status: string) =>
      updateFilter("status", status === ALL_STATUSES ? null : status),
    [updateFilter],
  );

  // Identity of the active filter set (URL-derived). Keying the boundaries on
  // it swaps the resolved grid back to its skeleton the moment a filter changes.
  const searchKey = filterKeyOf(searchParams);

  const isRevalidating =
    navigation.state === "loading" &&
    navigation.location?.pathname === BASE_PATH;

  // The loader still awaits the filter options before the new page renders, so
  // the Suspense boundary alone would leave the stale grid on screen for that
  // whole window. Show the skeleton as soon as the pending URL differs — but
  // not for a plain revalidation (a delete or suspend), which keeps its cards.
  const isFiltering =
    isRevalidating &&
    filterKeyOf(new URLSearchParams(navigation.location?.search)) !== searchKey;

  const hasFilters =
    searchInput !== "" ||
    activeCategory !== ALL_CATEGORIES ||
    activeCity !== ALL_CITIES ||
    activeStatus !== ALL_STATUSES;

  // Counts from a previous filter set would be misleading, so only trust stats
  // reported for the filters currently in the URL.
  const currentStats = stats?.key === searchKey ? stats : null;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                Launchpad Management
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Review and moderate projects posted to the launchpad.
              </p>
            </div>

            {isFiltering ? (
              <Skeleton className="h-7 w-32 rounded-full" />
            ) : (
              <Suspense
                key={searchKey}
                fallback={<Skeleton className="h-7 w-32 rounded-full" />}
              >
                <Await
                  resolve={data}
                  errorElement={<ContentCountUnavailable />}
                >
                  {(firstPage) => (
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          isRevalidating
                            ? "animate-pulse bg-amber-400"
                            : "bg-emerald-500",
                        )}
                      />
                      {currentStats?.loaded ?? firstPage.launchpads.length}{" "}
                      loaded
                      {(currentStats?.hasMore ?? Boolean(firstPage.nextCursor))
                        ? "+"
                        : ""}
                    </span>
                  )}
                </Await>
              </Suspense>
            )}
          </div>

          <ManageLaunchpadToolbar
            categories={categoryOptions}
            cities={cities}
            searchValue={searchInput}
            statusValue={activeStatus}
            allValue={ALL_STATUSES}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />

          {isFiltering ? (
            <ManageLaunchpadCardsSkeleton />
          ) : (
            <Suspense
              key={searchKey}
              fallback={<ManageLaunchpadCardsSkeleton />}
            >
              <Await
                resolve={data}
                errorElement={<ContentLoadError noun="projects" />}
              >
                {(firstPage) => (
                  <ManageLaunchpadProjects
                    firstPage={firstPage}
                    searchKey={searchKey}
                    hasFilters={hasFilters}
                    onStatsChange={setStats}
                  />
                )}
              </Await>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
