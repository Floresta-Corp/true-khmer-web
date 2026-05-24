import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import SavedItemsSidebar from "../saved-items-sidebar";
import type { loader } from "../../routes/saved-items";
import type { FilterId } from "../saved-item-filter";
import type { Question } from "~/services/forum/forum-types";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import SavedItemsGrid from "../saved-items-gride";
import type {
  CountSavedItemResponse,
  ItemElement,
} from "~/services/saved-items/saved-items-types";

const VALID_FILTERS: FilterId[] = [
  "all",
  "forum",
  "volunteer",
  "launchpad",
  "event",
];

function getFilterFromParams(searchParams: URLSearchParams): FilterId {
  const raw = searchParams.get("filter");
  return VALID_FILTERS.includes(raw as FilterId) ? (raw as FilterId) : "all";
}

function groupSavedItems(items: ItemElement[]) {
  const forums = items
    .filter((v) => v.type === "forum")
    .map((v) => v.item as unknown as Question);

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
  const {
    saveItem: initialSaveItem,
    count: initialCount,
    pagination: initialPagination,
  } = useLoaderData<typeof loader>();
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

  useEffect(() => {
    const data = fetcher.data as Awaited<ReturnType<typeof loader>> | undefined;
    if (!data) return;

    if (lastFetchUrl.current.includes("cursor=")) {
      setSaveItem((prev) => {
        const existing = new Set(prev.map((i) => `${i.type}:${i.item.id}`));
        const newItems = data.saveItem.filter((i) => !existing.has(`${i.type}:${i.item.id}`));
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
    if (activeFilter === "event") return;

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

    if (id === "event") return;

    const url = `/saved-items?${params.toString()}`;
    lastFetchUrl.current = url;
    fetcher.load(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
          className="flex flex-col gap-10 lg:flex-row"
        >
          <SavedItemsSidebar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            counts={{
              all: count?.all,
              forum: count?.forum,
              event: 0,
              volunteer: count?.volunteer,
              launchpad: count?.project,
            }}
          />

          <main className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                delay: prefersReducedMotion ? 0 : 0.15,
                ease: "easeOut",
              }}
              className="mb-10 lg:mb-16"
            >
              <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">
                Saved Items
              </h1>
              <p className="text-[15px] font-medium text-slate-500 sm:text-base">
                Managing all your saved items across the platform.
              </p>
            </motion.div>

            <SavedItemsGrid
              activeFilter={activeFilter}
              savedForums={forums}
              savedVolunteers={volunteers}
              savedLaunchpads={launchpads}
              isLoading={fetcher.state !== "idle" && !lastFetchUrl.current.includes("cursor=")}
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
      </div>
    </div>
  );
}
