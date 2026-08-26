import { motion, useReducedMotion } from "motion/react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { forumSearchLoader } from "../services/forum-search.loader";
import ForumSearchHeader from "../components/sections/forum-search-header";
import ForumSearchResultsSection from "../components/sections/forum-search-results-section";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import type {
  QuestionResponse,
  GetQuestionsResponse,
} from "~/types/api-client";
import { forumSearchAction } from "../services/forum-search.action";

export const loader = forumSearchLoader;
export const action = forumSearchAction;

export function meta() {
  return [{ title: "Search Discussions | True Khmer" }];
}

export default function ForumSearchPage() {
  const { data, categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isLoading = fetcher.state === "loading";
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() || "";
  const [searchValue, setSearchValue] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Identity of the active filter set. Page 1 always comes from the loader;
  // when this changes, any pages accumulated via "load more" are dropped.
  const searchKey =
    search +
    (searchParams.get("sortBy") || "") +
    (searchParams.get("categoryId") || "") +
    (searchParams.get("tagId") || "") +
    (searchParams.get("isUnanswered") || "") +
    (searchParams.get("isTrending") || "");

  // Pages fetched *beyond* page 1. Page 1 is derived directly from the loader,
  // so an unrelated loader revalidation (e.g. after a vote/report) refreshes it
  // without discarding these accumulated pages.
  const [extraPages, setExtraPages] = useState<QuestionResponse[]>([]);
  const [extraPagination, setExtraPagination] = useState<
    GetQuestionsResponse["pagination"] | null
  >(null);

  // Keep the search input in sync with the URL (e.g. on back/forward navigation).
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Reset accumulated pages whenever the active filters change.
  useEffect(() => {
    setExtraPages([]);
    setExtraPagination(null);
  }, [searchKey]);

  // Append newly fetched pages, de-duping against page 1 and prior extra pages.
  useEffect(() => {
    const fetcherData = fetcher.data?.data as GetQuestionsResponse | undefined;
    if (!fetcherData) return;

    setExtraPages((prev) => {
      const seen = new Set([
        ...(data.questions ?? []).map((q) => q.id),
        ...prev.map((q) => q.id),
      ]);
      const fresh = fetcherData.questions.filter((q) => !seen.has(q.id));
      return [...prev, ...fresh];
    });
    setExtraPagination(fetcherData.pagination);
  }, [fetcher.data?.data]);

  // Page 1 (fresh from the loader) + accumulated extra pages.
  const questionList = useMemo(() => {
    const base = data.questions ?? [];
    if (extraPages.length === 0) return base;
    const seen = new Set(base.map((q) => q.id));
    return [...base, ...extraPages.filter((q) => !seen.has(q.id))];
  }, [data.questions, extraPages]);

  // Pagination follows the most recently loaded page.
  const pagination = extraPagination ?? data.pagination;
  const hasMore = pagination?.hasMore;
  const nextCursor = pagination?.nextCursor ?? undefined;

  const isLoadingMore = isLoading && questionList.length > 0;

  const buildSearchQuery = useCallback(
    (cursor?: string) => {
      const params = new URLSearchParams(searchParams);
      if (cursor) {
        params.set("cursor", cursor);
      }
      return `/forum/search?${params.toString()}`;
    },
    [searchParams],
  );

  const handleLoadMore = useCallback(() => {
    if (questionList.length === 0) return;
    if (fetcher.state === "loading") return;
    if (hasMore === false) return;

    if (nextCursor) {
      fetcher.load(buildSearchQuery(nextCursor));
    }
  }, [
    questionList.length,
    fetcher.state,
    fetcher.load,
    hasMore,
    nextCursor,
    buildSearchQuery,
  ]);

  // Single helper for every filter/search change to the URL.
  const updateSearchParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const nextParams = new URLSearchParams(searchParams);
      mutate(nextParams);
      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [searchParams, setSearchParams],
  );

  const handleSearch = (value: string) =>
    updateSearchParams((params) => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
    });

  const handleSortByChange = (value: string) =>
    updateSearchParams((params) => params.set("sortBy", value));

  const handleCategoryChange = (value: string) =>
    updateSearchParams((params) => {
      if (value === "all-categories") {
        params.delete("categoryId");
      } else {
        params.set("categoryId", value);
      }
    });

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams(), {
      replace: true,
      preventScrollReset: true,
    });
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleClearSearchValue = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const categoriesPicker = categories.map((c) => ({
    id: c.id,
    name: c.name,
    count: c.questionCount,
  }));

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      >
        <ForumSearchHeader
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          onSearch={handleSearch}
          ref={inputRef}
        />
      </motion.div>
      <div key={searchKey}>
        <ForumSearchResultsSection
          search={search}
          data={{ ...data, questions: questionList }}
          categories={categoriesPicker}
          onClearSearch={handleClearAll}
          onClearSearchValue={handleClearSearchValue}
          onSortChange={handleSortByChange}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          sortBy={searchParams.get("sortBy") || "mostRelevant"}
          categoryId={searchParams.get("categoryId") || "all-categories"}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
