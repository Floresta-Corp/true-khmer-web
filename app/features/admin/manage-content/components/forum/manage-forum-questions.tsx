import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MessageSquare } from "lucide-react";
import { useFetcher, useSearchParams } from "react-router";

import type {
  GetQuestionsResponse,
  QuestionResponse,
} from "~/types/api-client";
import { useForumModeration } from "../../hooks/use-forum-moderation";
import type { manageForumLoader } from "../../services/manage-forum.loader";
import { ALL_CATEGORIES } from "../../types";
import DeleteForumQuestionDialog from "./delete-forum-question-dialog";
import ManageForumQuestionRow from "./manage-forum-question-row";
import SuspendForumPostDialog from "./suspend-forum-post-dialog";

const LIMIT = 10;

export const BASE_PATH = "/tk-admin/manage-forum";

export const FILTER_KEYS = [
  "categoryId",
  "sortBy",
  "status",
  "search",
] as const;

export const filterKeyOf = (params: URLSearchParams) =>
  FILTER_KEYS.map((key) => params.get(key) || "").join("|");

export type ListStats = { key: string; loaded: number; total: number };

interface ManageForumQuestionsProps {
  firstPage: GetQuestionsResponse;
  searchKey: string;
  activeCategory: string;
  onStatsChange: (stats: ListStats) => void;
}

export default function ManageForumQuestions({
  firstPage,
  searchKey,
  activeCategory,
  onStatsChange,
}: ManageForumQuestionsProps) {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof manageForumLoader>();

  const [extraPages, setExtraPages] = useState<QuestionResponse[]>([]);
  const [extraPagination, setExtraPagination] = useState<
    GetQuestionsResponse["pagination"] | null
  >(null);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);
  const requestedCursorRef = useRef<string | null>(null);

  const {
    removedIds,
    deleteQuestion,
    suspendQuestion,
    unsuspendQuestion,
    isDeleting,
  } = useForumModeration();

  const buildForumQuery = useCallback(
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
            ...firstPage.questions.map((question) => question.id),
            ...prev.map((question) => question.id),
          ]);
          const fresh = nextPage.questions.filter(
            (question) => !seen.has(question.id),
          );
          return [...prev, ...fresh];
        });
        setExtraPagination(nextPage.pagination);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadMoreFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher.data?.data, firstPage.questions]);

  const questions = useMemo(() => {
    const seen = new Set(firstPage.questions.map((question) => question.id));
    const merged = [
      ...firstPage.questions,
      ...extraPages.filter((question) => !seen.has(question.id)),
    ];
    if (removedIds.size === 0) return merged;
    return merged.filter((question) => !removedIds.has(question.id));
  }, [firstPage.questions, extraPages, removedIds]);

  const pagination = extraPagination ?? firstPage.pagination;
  const totalCount = pagination.total ?? questions.length;
  const hasMore = pagination.hasMore;
  const nextCursor = pagination.nextCursor ?? undefined;

  useEffect(() => {
    onStatsChange({
      key: searchKey,
      loaded: questions.length,
      total: totalCount,
    });
  }, [onStatsChange, searchKey, questions.length, totalCount]);

  const isLoadingMore = fetcher.state === "loading";

  const handleLoadMore = useCallback(() => {
    if (questions.length === 0) return;
    if (isLoadingMore) return;
    if (hasMore === false) return;
    if (!nextCursor) return;
    if (loadMoreFailed) return;
    if (requestedCursorRef.current === nextCursor) return;

    requestedCursorRef.current = nextCursor;
    fetcher.load(buildForumQuery(nextCursor));
  }, [
    questions.length,
    isLoadingMore,
    hasMore,
    nextCursor,
    loadMoreFailed,
    fetcher.load,
    buildForumQuery,
  ]);

  const handleRetryLoadMore = useCallback(() => {
    if (!nextCursor) return;
    setLoadMoreFailed(false);
    requestedCursorRef.current = nextCursor;
    fetcher.load(buildForumQuery(nextCursor));
  }, [nextCursor, fetcher.load, buildForumQuery]);

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

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <MessageSquare size={26} />
        </span>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {activeCategory === ALL_CATEGORIES
            ? "No forum questions yet"
            : "No questions in this category"}
        </p>
        <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500">
          {activeCategory === ALL_CATEGORIES
            ? "Questions posted by the community will appear here."
            : "Try a different category to see more of the community's questions."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <ManageForumQuestionRow
          key={question.id}
          question={question}
          actions={
            question.status !== "DELETED" && (
              <>
                <SuspendForumPostDialog
                  postId={question.id}
                  postLabel={question.title}
                  noun="question"
                  suspended={question.status === "SUSPENDED"}
                  onSuspend={suspendQuestion}
                  onUnsuspend={unsuspendQuestion}
                  disabled={isDeleting}
                  className="size-[26.25px]"
                />
                <DeleteForumQuestionDialog
                  questionId={question.id}
                  questionTitle={question.title}
                  onConfirm={deleteQuestion}
                  disabled={isDeleting}
                />
              </>
            )
          }
        />
      ))}

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-6"
        >
          {isLoadingMore ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Loader2 size={14} className="animate-spin" />
              Loading more questions…
            </span>
          ) : loadMoreFailed ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Couldn’t load more questions.
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
    </div>
  );
}
