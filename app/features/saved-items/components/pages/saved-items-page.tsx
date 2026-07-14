import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import SavedItemsFilterBar from "../saved-items-filter-bar";
import type { loader } from "../../route/saved-items";
import type { SavedItemsLoaderData } from "~/features/saved-items/services/saved-items.loader";
import type { QuestionResponse } from "~/types/api-client";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import SavedItemsGrid from "../saved-items-gride";
import type {
  CountSavedItemResponse,
  FilterId,
  ItemElement,
} from "~/features/saved-items/types";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";

const VALID_FILTERS: FilterId[] = ["all", "forum", "volunteer", "launchpad"];

function getFilterFromParams(searchParams: URLSearchParams): FilterId {
  const raw = searchParams.get("filter");
  return VALID_FILTERS.includes(raw as FilterId) ? (raw as FilterId) : "all";
}

function groupSavedItems(items: ItemElement[]) {
  const forums = items
    .filter((v) => v.type === "forum")
    .map((v) => v.item as unknown as QuestionResponse);

  const volunteers = items
    .filter((v) => v.type === "volunteer")
    .map((v) => v.item as unknown as Opportunity);

  const launchpads = items
    .filter((v) => v.type === "project")
    .map((v) => v.item as unknown as LaunchpadOpportunity);

  return { forums, volunteers, launchpads };
}

export default function SaveItemPage() {
  const prefersReducedMotion = useReducedMotion();
  const loaderData = useLoaderData<typeof loader>() as SavedItemsLoaderData;
  const {
    saveItem: initialSaveItem,
    count: initialCount,
    pagination: initialPagination,
  } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof loader>();

  const [saveItem, setSaveItem] = useState<ItemElement[]>(initialSaveItem);
  const [count, setCount] = useState<CountSavedItemResponse>(initialCount);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPagination?.nextCursor ?? null,
  );
  const [hasMore, setHasMore] = useState(initialPagination?.hasMore ?? false);
  const [activeFilter, setActiveFilter] = useState<FilterId>(() =>
    getFilterFromParams(searchParams),
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastFetchUrl = useRef("");

  useEffect(() => {
    const urlFilter = getFilterFromParams(searchParams);
    if (urlFilter !== activeFilter) {
      setActiveFilter(urlFilter);
      setNextCursor(null);
      setHasMore(false);
      const url = `/saved-items?${searchParams.toString()}`;
      lastFetchUrl.current = url;
      fetcher.load(url);
    }
  }, [searchParams]);

  // Merge revalidated loader data (e.g. after voting on a saved question)
  // into the accumulated list without discarding pages loaded via infinite scroll.
  useEffect(() => {
    const fresh = loaderData?.saveItem ?? [];
    setCount(loaderData.count);

    if (!fresh.length) return;

    const freshByKey = new Map(fresh.map((i) => [`${i.type}:${i.item.id}`, i]));
    setSaveItem((prev) => {
      let changed = false;
      const merged = prev.map((i) => {
        const updated = freshByKey.get(`${i.type}:${i.item.id}`);

        if (
          updated &&
          (updated.item.score !== i.item.score ||
            updated.item.viewerVote !== i.item.viewerVote)
        ) {
          changed = true;
          return updated;
        }
        return i;
      });
      return changed ? merged : prev;
    });
  }, [loaderData]);

  useEffect(() => {
    const data = fetcher.data as SavedItemsLoaderData | undefined;
    if (!data) return;

    if (lastFetchUrl.current.includes("cursor=")) {
      setSaveItem((prev) => {
        const existing = new Set(prev.map((i) => `${i.type}:${i.item.id}`));
        const newItems = data.saveItem.filter(
          (i) => !existing.has(`${i.type}:${i.item.id}`),
        );
        return [...prev, ...newItems];
      });
    } else {
      setSaveItem(data.saveItem);
    }

    setCount(data.count);
    setNextCursor(data.pagination?.nextCursor ?? null);
    setHasMore(data.pagination?.hasMore ?? false);
  }, [fetcher.data]);

  const loadMore = useCallback(() => {
    if (fetcher.state === "loading" || !hasMore || !nextCursor) return;

    const params = new URLSearchParams();
    if (activeFilter !== "all") params.set("filter", activeFilter);
    params.set("cursor", nextCursor);

    const url = `/saved-items?${params.toString()}`;
    lastFetchUrl.current = url;
    fetcher.load(url);
  }, [fetcher.state, hasMore, nextCursor, activeFilter]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const { forums, volunteers, launchpads } = useMemo(
    () => groupSavedItems(saveItem),
    [saveItem],
  );

  const handleFilterChange = (id: FilterId) => {
    setActiveFilter(id);
    setNextCursor(null);
    setHasMore(false);

    const params = new URLSearchParams();
    if (id !== "all") params.set("filter", id);

    setSearchParams(params, { replace: true, preventScrollReset: true });

    const url = `/saved-items?${params.toString()}`;
    lastFetchUrl.current = url;
    fetcher.load(url);
  };

  return (
    <ForumPageLayout className="min-h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
          ease: "easeOut",
        }}
      >
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mb-16">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
              Saved Items
            </h1>
            <p className="text-[15px] font-medium text-slate-500 sm:text-base">
              Managing all your saved items across the platform (
              {count?.all ?? 0} total).
            </p>
          </div>

          <SavedItemsFilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        <main className="min-w-0">
          <SavedItemsGrid
            activeFilter={activeFilter}
            savedForums={forums}
            savedVolunteers={volunteers}
            savedLaunchpads={launchpads}
            isLoading={
              fetcher.state !== "idle" &&
              !lastFetchUrl.current.includes("cursor=")
            }
          />

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              {fetcher.state === "loading" && (
                <Loader2 className="size-6 animate-spin text-slate-400" />
              )}
            </div>
          )}
        </main>
      </motion.div>
    </ForumPageLayout>
  );
}
