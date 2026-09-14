import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import SavedItemsFilterBar from "../saved-items-filter-bar";
import SavedItemsGrid from "../saved-items-gride";
import type { loader } from "../../route/saved-items";
import type { SavedItemsLoaderData } from "~/features/saved-items/services/saved-items.loader";
import {
  type FilterId,
  type SavedItemCard,
  type SavedItemCounts,
} from "~/features/saved-items/types";
import { ForumPageLayout } from "~/features/forum/components/forum-page-layout";

const VALID_FILTERS: FilterId[] = [
  "all",
  "forum",
  "volunteer",
  "project",
  "course",
  "event",
];

function getFilterFromParams(searchParams: URLSearchParams): FilterId {
  const raw = searchParams.get("filter");
  // "launchpad" is what older links used for what the API calls "project".
  const normalized = raw === "launchpad" ? "project" : raw;
  return VALID_FILTERS.includes(normalized as FilterId)
    ? (normalized as FilterId)
    : "all";
}

export default function SaveItemPage() {
  const prefersReducedMotion = useReducedMotion();
  const loaderData = useLoaderData<typeof loader>() as SavedItemsLoaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const listFetcher = useFetcher<typeof loader>();
  const unsaveFetcher = useFetcher();

  const [items, setItems] = useState<SavedItemCard[]>(loaderData.saveItem);
  const [counts, setCounts] = useState<SavedItemCounts>(loaderData.count);
  const [nextCursor, setNextCursor] = useState<string | null>(
    loaderData.nextCursor,
  );
  const [activeFilter, setActiveFilter] = useState<FilterId>(() =>
    getFilterFromParams(searchParams),
  );
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastFetchUrl = useRef("");

  const buildUrl = useCallback((filter: FilterId, cursor?: string) => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("filter", filter);
    if (cursor) params.set("cursor", cursor);
    const search = params.toString();
    return `/saved-items${search ? `?${search}` : ""}`;
  }, []);

  // A filter change arriving through the URL (back button, shared link).
  useEffect(() => {
    const urlFilter = getFilterFromParams(searchParams);
    if (urlFilter !== activeFilter) {
      setActiveFilter(urlFilter);
      setNextCursor(null);
      const url = buildUrl(urlFilter);
      lastFetchUrl.current = url;
      listFetcher.load(url);
    }
  }, [searchParams]);

  useEffect(() => {
    setItems(loaderData.saveItem);
    setCounts(loaderData.count);
    setNextCursor(loaderData.nextCursor);
  }, [loaderData]);

  useEffect(() => {
    const data = listFetcher.data as SavedItemsLoaderData | undefined;
    if (!data) return;

    if (lastFetchUrl.current.includes("cursor=")) {
      // Appending a page: the cursor is stable, but guard against a row that
      // moved across the boundary anyway.
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.id));
        return [...prev, ...data.saveItem.filter((i) => !seen.has(i.id))];
      });
    } else {
      setItems(data.saveItem);
    }

    setCounts(data.count);
    setNextCursor(data.nextCursor);
  }, [listFetcher.data]);

  const loadMore = useCallback(() => {
    if (listFetcher.state === "loading" || !nextCursor) return;
    const url = buildUrl(activeFilter, nextCursor);
    lastFetchUrl.current = url;
    listFetcher.load(url);
  }, [listFetcher.state, nextCursor, activeFilter, buildUrl]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleFilterChange = (id: FilterId) => {
    setActiveFilter(id);
    setNextCursor(null);

    const params = new URLSearchParams();
    if (id !== "all") params.set("filter", id);
    setSearchParams(params, { replace: true, preventScrollReset: true });

    const url = buildUrl(id);
    lastFetchUrl.current = url;
    listFetcher.load(url);
  };

  // Optimistic: the row leaves the grid and the counts drop immediately, and
  // the list is reloaded once the server confirms.
  const handleUnsave = useCallback(
    (item: SavedItemCard) => {
      setRemovingIds((prev) => new Set(prev).add(item.id));
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setCounts((prev) => ({
        ...prev,
        all: Math.max(0, prev.all - 1),
        [item.type]: Math.max(0, prev[item.type] - 1),
      }));

      unsaveFetcher.submit(
        { actionType: "unsave", type: item.type, itemId: item.itemId },
        { method: "post", action: "/saved-items" },
      );
    },
    [unsaveFetcher],
  );

  useEffect(() => {
    if (unsaveFetcher.state !== "idle" || !unsaveFetcher.data) return;
    setRemovingIds(new Set());

    const url = buildUrl(activeFilter);
    lastFetchUrl.current = url;
    listFetcher.load(url);
  }, [unsaveFetcher.state, unsaveFetcher.data]);

  return (
    <ForumPageLayout className="min-h-full lg:px-10">
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
              Managing all your saved items across the platform ({counts.all}{" "}
              total).
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
            items={items}
            removingIds={removingIds}
            onUnsave={handleUnsave}
            userId={loaderData.userId ?? undefined}
            isLoading={
              listFetcher.state !== "idle" &&
              !lastFetchUrl.current.includes("cursor=")
            }
          />

          {nextCursor && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              {listFetcher.state === "loading" && (
                <Loader2 className="size-6 animate-spin text-slate-400" />
              )}
            </div>
          )}
        </main>
      </motion.div>
    </ForumPageLayout>
  );
}
