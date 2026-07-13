import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useFetcher } from "react-router";
import WorkspaceDiscussionCard from "~/features/workspace/components/card/workspace-discussion-card";
import type { loader } from "~/features/workspace/route/workspace";
import { Skeleton } from "~/components/ui/skeleton";
import type { MyWorkSpaceLoaderData } from "~/features/workspace/services/work-space-loader";
import type { GetMyAnswersResponse } from "~/types/api-client";

type Discussion = GetMyAnswersResponse["discussions"][number];

type Props = {
  answers: GetMyAnswersResponse;
};

function AnswerCardSkeleton() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Skeleton className="h-6.5 w-6.5 rounded-xl" />
          <Skeleton className="h-6.5 w-6.5 rounded-xl" />
        </div>
      </div>
      <Skeleton className="mb-1.5 h-3 w-24" />
      <Skeleton className="mb-3 h-5 w-3/4" />
      <div className="mb-4 rounded-r-lg border-l-4 border-slate-200 bg-slate-50 px-4 py-3">
        <Skeleton className="mb-1.5 h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
      <div className="border-t border-slate-100 pt-3">
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export default function WorkspaceAnswerList({ answers }: Props) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof loader>();

  const currentSearch = searchParams.get("search") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  const [discussions, setDiscussions] = useState<Discussion[]>(
    answers?.discussions ?? [],
  );
  const [pagination, setPagination] = useState(answers?.pagination);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset accumulated list when filters change
  const filterKey = `${currentSearch}|${currentSortBy}|${currentCategory}`;
  const prevFilterKeyRef = useRef(filterKey);
  useEffect(() => {
    if (prevFilterKeyRef.current === filterKey) return;
    prevFilterKeyRef.current = filterKey;
    setDiscussions(answers?.discussions ?? []);
    setPagination(answers?.pagination);
  }, [filterKey, answers]);

  // Sync revalidated loader data (e.g. after editing/deleting an answer) into
  // the accumulated list without discarding pages loaded via infinite scroll.
  useEffect(() => {
    if (prevFilterKeyRef.current !== filterKey) return;
    const fresh = answers?.discussions ?? [];
    const freshById = new Map(fresh.map((d) => [d.question.id, d]));
    setDiscussions((prev) => {
      const prevIds = new Set(prev.map((d) => d.question.id));
      // Prepend discussions that appear in the revalidated first page but
      // aren't in the accumulated list yet (e.g. a freshly posted answer,
      // which the default "lastActivity" sort puts at the top).
      const added = fresh.filter((d) => !prevIds.has(d.question.id));
      // Update existing items in place so edits are reflected without
      // discarding pages loaded via infinite scroll.
      const updated = prev.map((d) => freshById.get(d.question.id) ?? d);
      return added.length ? [...added, ...updated] : updated;
    });
  }, [answers, filterKey]);

  // Append next page when the fetcher returns data
  useEffect(() => {
    if (!fetcher.data) return;
    const next = (fetcher.data as MyWorkSpaceLoaderData)?.answers;
    if (!next?.discussions?.length) return;
    setDiscussions((prev) => [...prev, ...next.discussions]);
    setPagination(next.pagination);
  }, [fetcher.data]);

  const loadMore = useCallback(() => {
    if (
      !pagination?.hasMore ||
      !pagination?.nextCursor ||
      fetcher.state !== "idle"
    )
      return;
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    if (currentSortBy) params.set("sortBy", currentSortBy);
    if (currentCategory) params.set("category", currentCategory);
    params.set("cursor", pagination.nextCursor);
    params.set("limit", "10");
    params.set("tab", "answers");
    fetcher.load(`/workspace?${params.toString()}`);
  }, [pagination, fetcher, currentSearch, currentSortBy, currentCategory]);

  // IntersectionObserver fires loadMore when the sentinel nears the bottom.
  // The page scrolls inside a nested `overflow-y-auto` container (SidebarInset),
  // so the observer must use that scroll ancestor as its root — not the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
      let parent = node?.parentElement ?? null;
      while (parent) {
        const overflowY = getComputedStyle(parent).overflowY;
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          parent.scrollHeight > parent.clientHeight
        ) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { root: getScrollParent(el), rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {discussions.map((discussion, index) => (
        <WorkspaceDiscussionCard
          key={discussion.question.id}
          discussion={discussion}
          index={index}
        />
      ))}

      {/* Sentinel — triggers loadMore when it enters the viewport */}
      <div ref={sentinelRef} className="h-1" />

      {/* Skeleton cards while fetching the next page */}
      {fetcher.state !== "idle" && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <AnswerCardSkeleton key={i} />
          ))}
        </>
      )}

      {/* End-of-list indicator */}
      {!pagination?.hasMore && discussions.length > 0 && (
        <p className="py-4 text-center text-xs text-slate-400">
          You've seen all your answers.
        </p>
      )}
    </div>
  );
}
