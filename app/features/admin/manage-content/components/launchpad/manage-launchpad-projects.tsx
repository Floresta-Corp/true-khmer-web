import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Rocket } from "lucide-react";
import { useFetcher, useSearchParams } from "react-router";

import type {
  AdminLaunchpadPostListItemResponse,
  AdminLaunchpadPostsResponse,
} from "~/types/api-client";
import { useLaunchpadModeration } from "../../hooks/use-launchpad-moderation";
import type { manageLaunchpadLoader } from "../../services/manage-launchpad.loader";
import DeleteLaunchpadDialog from "./delete-launchpad-dialog";
import ManageLaunchpadCard from "./manage-launchpad-card";
import SuspendLaunchpadDialog from "./suspend-launchpad-dialog";

const LIMIT = 12;

export const BASE_PATH = "/tk-admin/manage-launchpad";

export const FILTER_KEYS = [
  "search",
  "categoryId",
  "cityId",
  "status",
  "sortBy",
] as const;

export const filterKeyOf = (params: URLSearchParams) =>
  FILTER_KEYS.map((key) => params.get(key) || "").join("|");
export type ListStats = { key: string; loaded: number; hasMore: boolean };

interface ManageLaunchpadProjectsProps {
  firstPage: AdminLaunchpadPostsResponse;
  searchKey: string;
  hasFilters: boolean;
}

export default function ManageLaunchpadProjects({
  firstPage,
  searchKey,
  hasFilters,
}: ManageLaunchpadProjectsProps) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof manageLaunchpadLoader>();

  const [extraPages, setExtraPages] = useState<
    AdminLaunchpadPostListItemResponse[]
  >([]);
  const [extraCursor, setExtraCursor] = useState<string | null | undefined>();
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const requestedCursorRef = useRef<string | null>(null);

  const {
    removedIds,
    deleteProject,
    suspendProject,
    unsuspendProject,
    isModerating,
  } = useLaunchpadModeration();

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
  useEffect(() => {
    const pending = fetcher.data?.data;
    if (!pending) return;

    let cancelled = false;
    void Promise.resolve(pending)
      .then((nextPage) => {
        if (cancelled) return;

        setExtraPages((prev) => {
          const seen = new Set([
            ...firstPage.launchpads.map((project) => project.id),
            ...prev.map((project) => project.id),
          ]);
          const fresh = nextPage.launchpads.filter(
            (project) => !seen.has(project.id),
          );
          return [...prev, ...fresh];
        });
        setExtraCursor(nextPage.nextCursor);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadMoreFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher.data?.data, firstPage.launchpads]);

  const projects = useMemo(() => {
    const seen = new Set(firstPage.launchpads.map((project) => project.id));
    const merged = [
      ...firstPage.launchpads,
      ...extraPages.filter((project) => !seen.has(project.id)),
    ];
    if (removedIds.size === 0) return merged;
    return merged.filter((project) => !removedIds.has(project.id));
  }, [firstPage.launchpads, extraPages, removedIds]);

  const cursor = extraCursor === undefined ? firstPage.nextCursor : extraCursor;
  const hasMore = Boolean(cursor);

  const isLoadingMore = fetcher.state === "loading";

  const handleLoadMore = useCallback(() => {
    if (!cursor) return;
    if (isLoadingMore) return;
    if (loadMoreFailed) return;
    if (requestedCursorRef.current === cursor) return;

    requestedCursorRef.current = cursor;
    fetcher.load(buildQuery(cursor));
  }, [cursor, isLoadingMore, loadMoreFailed, fetcher.load, buildQuery]);

  const handleRetryLoadMore = useCallback(() => {
    if (!cursor) return;
    setLoadMoreFailed(false);
    requestedCursorRef.current = cursor;
    fetcher.load(buildQuery(cursor));
  }, [cursor, fetcher.load, buildQuery]);

  const sentinelRef = useRef<HTMLDivElement>(null);

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

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Rocket size={26} />
        </span>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {hasFilters ? "No matching projects" : "No projects yet"}
        </p>
        <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500">
          {hasFilters
            ? "Try a different search term, category, city, or status."
            : "Projects posted to the launchpad will appear here."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ManageLaunchpadCard
            key={project.id}
            project={project}
            actions={
              project.status !== "DELETED" && (
                <>
                  <SuspendLaunchpadDialog
                    launchpadId={project.id}
                    projectName={project.name}
                    suspended={project.status === "SUSPENDED"}
                    onSuspend={suspendProject}
                    onUnsuspend={unsuspendProject}
                    disabled={isModerating}
                  />
                  <DeleteLaunchpadDialog
                    launchpadId={project.id}
                    projectName={project.name}
                    onConfirm={deleteProject}
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
          {isLoadingMore ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Loader2 size={14} className="animate-spin" />
              Loading more projects…
            </span>
          ) : loadMoreFailed ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Couldn’t load more projects.
              <button
                type="button"
                onClick={handleRetryLoadMore}
                className="font-semibold text-slate-900 underline underline-offset-2 dark:text-white"
              >
                Retry
              </button>
            </span>
          ) : null}
        </div>
      )}
    </>
  );
}
