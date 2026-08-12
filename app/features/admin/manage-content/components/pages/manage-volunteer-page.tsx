import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import {
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";

import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import type {
  AdminVolunteerPostListItemResponse,
  AdminVolunteerPostsResponse,
} from "~/types/api-client";
import { useVolunteerModeration } from "../../hooks/use-volunteer-moderation";
import type { manageVolunteerLoader } from "../../services/manage-volunteer.loader";
import DeleteVolunteerDialog from "../volunteer/delete-volunteer-dialog";
import ManageVolunteerCard from "../volunteer/manage-volunteer-card";
import { ManageVolunteerCardsSkeleton } from "../volunteer/manage-volunteer-page-skeleton";
import {
  ALL_CATEGORIES,
  ALL_LOCATIONS,
  ManageVolunteerToolbar,
  readVolunteerFilters,
} from "../volunteer/manage-volunteer-toolbar";
import SuspendVolunteerDialog from "../volunteer/suspend-volunteer-dialog";

const LIMIT = 12;
const BASE_PATH = "/tk-admin/manage-volunteer";

const ALL_STATUSES = "all-statuses";

type Opportunity = AdminVolunteerPostListItemResponse;
type FilterKey = "search" | "categoryId" | "locationId" | "status";

const FILTER_KEYS: FilterKey[] = [
  "search",
  "categoryId",
  "locationId",
  "status",
];

/** Identity of a filter set, cursor excluded, so paging keeps the same key. */
const filterKeyOf = (params: URLSearchParams) =>
  FILTER_KEYS.map((key) => params.get(key) || "").join("|");

export default function ManageVolunteerPage() {
  const { opportunities, pagination, categories, locations } =
    useLoaderData<typeof manageVolunteerLoader>();
  const fetcher = useFetcher<typeof manageVolunteerLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const [extraPages, setExtraPages] = useState<Opportunity[]>([]);
  const [extraPagination, setExtraPagination] = useState<
    AdminVolunteerPostsResponse["pagination"] | null
  >(null);

  const {
    removedIds,
    resetRemoved,
    deleteOpportunity,
    suspendOpportunity,
    unsuspendOpportunity,
    isModerating,
  } = useVolunteerModeration();

  const activeSearch = searchParams.get("search") ?? "";
  const { categoryId: activeCategory, locationId: activeLocation } =
    readVolunteerFilters(searchParams);
  const activeStatus = searchParams.get("status") || ALL_STATUSES;

  const updateFilter = useCallback(
    (key: FilterKey, value: string | null) => {
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

  const buildQuery = useCallback(
    (cursor: string) => {
      const params = new URLSearchParams();
      for (const key of FILTER_KEYS) {
        const value = searchParams.get(key);
        if (value) params.set(key, value);
      }
      params.set("limit", String(LIMIT));
      params.set("cursor", cursor);

      return `${BASE_PATH}?${params.toString()}`;
    },
    [searchParams],
  );

  const searchKey = filterKeyOf(searchParams);

  const requestedKeyRef = useRef(searchKey);

  useEffect(() => {
    setExtraPages([]);
    setExtraPagination(null);
    resetRemoved();
  }, [searchKey, resetRemoved]);

  useEffect(() => {
    const page = fetcher.data;
    if (!page) return;
    if (requestedKeyRef.current !== searchKey) return;

    setExtraPages((prev) => {
      const seen = new Set([
        ...opportunities.map((item) => item.id),
        ...prev.map((item) => item.id),
      ]);
      const fresh = page.opportunities.filter((item) => !seen.has(item.id));
      return [...prev, ...fresh];
    });
    setExtraPagination(page.pagination);
  }, [fetcher.data, searchKey]);

  // Page 1 (fresh from the loader) + accumulated extra pages.
  const visibleOpportunities = useMemo(() => {
    const seen = new Set(opportunities.map((item) => item.id));
    const merged = [
      ...opportunities,
      ...extraPages.filter((item) => !seen.has(item.id)),
    ];
    if (removedIds.size === 0) return merged;
    return merged.filter((item) => !removedIds.has(item.id));
  }, [opportunities, extraPages, removedIds]);

  const activePagination = extraPagination ?? pagination;
  const hasMore = Boolean(activePagination?.hasMore);
  const nextCursor = activePagination?.nextCursor ?? null;
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const isRevalidating =
    navigation.state === "loading" &&
    navigation.location?.pathname === BASE_PATH;

  const isFiltering =
    isRevalidating &&
    filterKeyOf(new URLSearchParams(navigation.location?.search)) !== searchKey;
  const isLoadingMore = fetcher.state === "loading";

  const handleLoadMore = useCallback(() => {
    if (!hasMore || !nextCursor) return;
    if (isLoadingMore || isRevalidating) return;

    requestedKeyRef.current = searchKey;
    fetcher.load(buildQuery(nextCursor));
  }, [
    hasMore,
    nextCursor,
    isLoadingMore,
    isRevalidating,
    searchKey,
    fetcher.load,
    buildQuery,
  ]);

  const sentinelRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, handleLoadMore]);

  const hasFilters =
    activeSearch !== "" ||
    activeCategory !== ALL_CATEGORIES ||
    activeLocation !== ALL_LOCATIONS ||
    activeStatus !== ALL_STATUSES;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                Volunteer Management
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Review and moderate volunteer opportunities posted by
                organizers.
              </p>
            </div>

            {isFiltering ? (
              <Skeleton className="h-7 w-32 rounded-full" />
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isRevalidating
                      ? "animate-pulse bg-amber-400"
                      : "bg-emerald-500",
                  )}
                />
                {visibleOpportunities.length} loaded{hasMore ? "+" : ""}
              </span>
            )}
          </div>

          <ManageVolunteerToolbar
            categories={categories}
            locations={locations}
            searchValue={searchInput}
            statusValue={activeStatus}
            allValue={ALL_STATUSES}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
          />

          {isFiltering ? (
            <ManageVolunteerCardsSkeleton />
          ) : visibleOpportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <HeartHandshake size={26} />
              </span>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {hasFilters
                  ? "No matching opportunities"
                  : "No opportunities yet"}
              </p>
              <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500">
                {hasFilters
                  ? "Try a different search term, category, or location."
                  : "Volunteer opportunities posted by organizers will appear here."}
              </p>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-4 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3",
                  isRevalidating && "opacity-60",
                )}
              >
                {visibleOpportunities.map((opportunity) => (
                  <ManageVolunteerCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    actions={
                      opportunity.status !== "DELETED" && (
                        <>
                          <SuspendVolunteerDialog
                            opportunityId={opportunity.id}
                            opportunityTitle={opportunity.title}
                            suspended={opportunity.status === "SUSPENDED"}
                            onSuspend={suspendOpportunity}
                            onUnsuspend={unsuspendOpportunity}
                            disabled={isModerating}
                          />
                          <DeleteVolunteerDialog
                            opportunityId={opportunity.id}
                            opportunityTitle={opportunity.title}
                            applicationCount={opportunity.applicationCount}
                            onConfirm={deleteOpportunity}
                            disabled={isModerating}
                          />
                        </>
                      )
                    }
                  />
                ))}
              </div>

              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="flex items-center justify-center py-6"
                >
                  {isLoadingMore && (
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                      <Loader2 size={14} className="animate-spin" />
                      Loading more opportunities…
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
