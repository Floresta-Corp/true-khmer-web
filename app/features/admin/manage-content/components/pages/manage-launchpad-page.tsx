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
  const activeSearch = searchParams.get("search") ?? "";

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
          next.delete("cursor");
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set("search", value);
          else next.delete("search");
          next.delete("cursor");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const handleStatusChange = useCallback(
    (status: string) =>
      updateFilter("status", status === ALL_STATUSES ? null : status),
    [updateFilter],
  );

  const searchKey = filterKeyOf(searchParams);

  const isRevalidating =
    navigation.state === "loading" &&
    navigation.location?.pathname === BASE_PATH;

  const isFiltering =
    isRevalidating &&
    filterKeyOf(new URLSearchParams(navigation.location?.search)) !== searchKey;

  const hasFilters =
    activeSearch !== "" ||
    activeCategory !== ALL_CATEGORIES ||
    activeCity !== ALL_CITIES ||
    activeStatus !== ALL_STATUSES;

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
          </div>

          <ManageLaunchpadToolbar
            categories={categoryOptions}
            cities={cities}
            searchValue={activeSearch}
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
