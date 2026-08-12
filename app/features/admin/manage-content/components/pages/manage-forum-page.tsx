import { Suspense, useCallback, useMemo, useState } from "react";
import {
  Await,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import type { CategoriesPicker } from "~/features/forum/types";
import { Skeleton } from "~/components/ui/skeleton";
import ContentLoadError, {
  ContentCountUnavailable,
} from "~/features/admin/components/content-load-error";
import { cn } from "~/lib/utils";
import type { manageForumLoader } from "../../services/manage-forum.loader";
import { ManageForumRowsSkeleton } from "../forum/manage-forum-page-skeleton";
import ManageForumQuestions, {
  BASE_PATH,
  FILTER_KEYS,
  filterKeyOf,
  type ListStats,
} from "../forum/manage-forum-questions";
import {
  ManageForumToolbar,
  readForumFilters,
} from "../forum/manage-forum-toolbar";
import { ALL_CATEGORIES } from "../../types";

const ALL_STATUSES = "all-statuses";

export default function ManageForumPage() {
  const { data, categories } = useLoaderData<typeof manageForumLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const [stats, setStats] = useState<ListStats | null>(null);

  const categoryOptions = useMemo<CategoriesPicker[]>(
    () => [
      {
        id: ALL_CATEGORIES,
        name: "All Categories",
        count: categories.reduce(
          (total, category) => total + (category.questionCount || 0),
          0,
        ),
      },
      ...categories.map((category) => ({
        id: category.id,
        name: category.name,
        count: category.questionCount ?? 0,
      })),
    ],
    [categories],
  );
  const searchKey = filterKeyOf(searchParams);

  const { categoryId: activeCategory } = readForumFilters(searchParams);
  const activeStatus = searchParams.get("status") || ALL_STATUSES;
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
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

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set("search", value);
    else nextParams.delete("search");
    nextParams.delete("cursor");
    setSearchParams(nextParams, { replace: true });
  };

  const handleStatusChange = useCallback(
    (status: string) =>
      updateFilter("status", status === ALL_STATUSES ? null : status),
    [updateFilter],
  );

  const isRevalidating =
    navigation.state === "loading" &&
    navigation.location?.pathname === BASE_PATH;

  const currentStats = stats?.key === searchKey ? stats : null;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                Forum Management
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Review and moderate questions posted by the community.
              </p>
            </div>

            <Suspense
              key={searchKey}
              fallback={<Skeleton className="h-7 w-40 rounded-full" />}
            >
              <Await resolve={data} errorElement={<ContentCountUnavailable />}>
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
                    Showing {currentStats?.loaded ?? firstPage.questions.length}{" "}
                    of {currentStats?.total ?? firstPage.pagination.total}
                  </span>
                )}
              </Await>
            </Suspense>
          </div>
          <ManageForumToolbar
            categories={categoryOptions}
            searchValue={searchInput}
            statusValue={activeStatus}
            allValue={ALL_STATUSES}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />

          <Suspense key={searchKey} fallback={<ManageForumRowsSkeleton />}>
            <Await
              resolve={data}
              errorElement={<ContentLoadError noun="questions" />}
            >
              {(firstPage) => (
                <ManageForumQuestions
                  firstPage={firstPage}
                  searchKey={searchKey}
                  activeCategory={activeCategory}
                  onStatsChange={setStats}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
