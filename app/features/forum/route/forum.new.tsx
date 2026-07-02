import {
  useLoaderData,
  useFetcher,
  useSearchParams,
  useNavigation,
} from "react-router";
import { motion, useReducedMotion } from "motion/react";
import type { QuestionResponse, GetQuestionsResponse, TrendingTagResponse } from "~/types/api-client";
import type { CategoriesPicker, QuestionSortBy } from "~/features/forum/types";
import { questionSortBySchema } from "~/features/forum/types";
import { useState, useEffect, useCallback, useMemo } from "react";
import { forumListloader } from "../services/forum.loader";
import ForumHeaderNew from "../components/sections/forum-header-new";
import ForumContentNew, {
  type ForumQuestionTab,
} from "../components/sections/forum-content-new";
import { forumListAction } from "../services/forum.action";

const LIMIT = 10;

export const loader = forumListloader;
export const action = forumListAction;

export function meta() {
  return [{ title: "Forum Discussions | True Khmer" }];
}

function getTabQueryFlags(tab: ForumQuestionTab) {
  if (tab === "topRated") {
    return { isTrending: "true", isUnanswered: undefined };
  }

  if (tab === "unanswered") {
    return { isTrending: undefined, isUnanswered: "true" };
  }

  return { isTrending: undefined, isUnanswered: undefined };
}

function getTabFromSearchParams(
  searchParams: URLSearchParams,
): ForumQuestionTab {
  if (searchParams.get("isUnanswered") === "true") {
    return "unanswered";
  }

  if (searchParams.get("isTrending") === "true") {
    return "topRated";
  }

  return "recent";
}

interface ForumFilters {
  sortBy: QuestionSortBy;
  activeTab: ForumQuestionTab;
  categoryId: string;
  tagId?: string;
}

/** Single source of truth for turning the active filter state into query params. */
function buildFilterParams({
  sortBy,
  activeTab,
  categoryId,
  tagId,
}: ForumFilters) {
  const params = new URLSearchParams();
  params.set("sortBy", sortBy);

  const { isTrending, isUnanswered } = getTabQueryFlags(activeTab);
  if (isTrending) {
    params.set("isTrending", isTrending);
  }
  if (isUnanswered) {
    params.set("isUnanswered", isUnanswered);
  }

  if (categoryId !== "all-categories") {
    params.set("categoryId", categoryId);
  }
  if (tagId) {
    params.set("tagId", tagId);
  }

  return params;
}

export default function ForumNewPage() {
  const { data, categories, tags } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  // Initialize filters from URL params
  const initialCategoryId = searchParams.get("categoryId");
  const initialTagId = searchParams.get("tagId");
  const initialSortBy = questionSortBySchema.safeParse(
    searchParams.get("sortBy"),
  );
  const initialTab = getTabFromSearchParams(searchParams);
  const initialCategory =
    initialCategoryId && categories.length > 0
      ? categories.find((c) => c.id === initialCategoryId) || {
          id: "all-categories",
          name: "All Categories",
        }
      : { id: "all-categories", name: "All Categories" };

  const [extraPages, setExtraPages] = useState<QuestionResponse[]>([]);
  const [extraPagination, setExtraPagination] = useState<
    GetQuestionsResponse["pagination"] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesPicker>(initialCategory);
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(
    initialTagId || undefined,
  );
  const [sortBy, setSortBy] = useState<QuestionSortBy>(
    initialSortBy.success ? initialSortBy.data : "newest",
  );
  const [activeTab, setActiveTab] = useState<ForumQuestionTab>(initialTab);
  const prefersReducedMotion = useReducedMotion();

  // Sync selectedCategory from URL when categoryId changes
  useEffect(() => {
    const urlCategoryId = searchParams.get("categoryId");
    if (urlCategoryId && categories.length > 0) {
      const foundCategory = categories.find((c) => c.id === urlCategoryId);
      if (foundCategory) {
        setSelectedCategory({
          id: foundCategory.id,
          name: foundCategory.name,
        });
      }
    } else if (!urlCategoryId) {
      setSelectedCategory({ id: "all-categories", name: "All Categories" });
    }
  }, [searchParams.get("categoryId"), categories]);

  const buildForumQuery = useCallback(
    (cursor?: string) => {
      const params = buildFilterParams({
        sortBy,
        activeTab,
        categoryId: selectedCategory.id,
        tagId: selectedTagId,
      });
      params.set("limit", String(LIMIT));

      if (cursor) {
        params.set("cursor", cursor);
      }

      return `/forum?${params.toString()}`;
    },
    [activeTab, selectedCategory.id, selectedTagId, sortBy],
  );

  // Identity of the active filter set (URL-derived). Page 1 comes from the
  // loader; when this changes, drop any pages accumulated via "load more".
  const searchKey =
    (searchParams.get("sortBy") || "") +
    (searchParams.get("categoryId") || "") +
    (searchParams.get("tagId") || "") +
    (searchParams.get("isUnanswered") || "") +
    (searchParams.get("isTrending") || "");

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
        ...(data?.questions ?? []).map((q) => q.id),
        ...prev.map((q) => q.id),
      ]);
      const fresh = fetcherData.questions.filter((q) => !seen.has(q.id));
      return [...prev, ...fresh];
    });
    setExtraPagination(fetcherData.pagination);
  }, [fetcher.data?.data]);

  // Page 1 (fresh from the loader) + accumulated extra pages.
  const questionList = useMemo(() => {
    const base = data?.questions ?? [];
    if (extraPages.length === 0) return base;
    const seen = new Set(base.map((q) => q.id));
    return [...base, ...extraPages.filter((q) => !seen.has(q.id))];
  }, [data?.questions, extraPages]);

  // Pagination follows the most recently loaded page.
  const pagination = extraPagination ?? data?.pagination;
  const hasMore = pagination?.hasMore;
  const nextCursor = pagination?.nextCursor ?? undefined;

  // While a same-route filter revalidation is in flight, show skeletons rather
  // than stale results (mirrors the previous clear-and-fetch behavior).
  const isRevalidating =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/forum";
  const displayedQuestions = isRevalidating ? [] : questionList;
  const isLoading = isRevalidating || fetcher.state === "loading";

  const handleLoadMore = useCallback(() => {
    if (questionList.length === 0) return;
    if (fetcher.state === "loading") return;
    if (hasMore === false) return;

    if (nextCursor) {
      fetcher.load(buildForumQuery(nextCursor));
    }
  }, [
    questionList.length,
    fetcher.state,
    fetcher.load,
    hasMore,
    nextCursor,
    buildForumQuery,
  ]);

  const applyFilterParams = useCallback(
    (filters: ForumFilters) => {
      setSearchParams(buildFilterParams(filters), {
        replace: true,
        preventScrollReset: true,
      });
    },
    [setSearchParams],
  );

  const handleCategorySelect = useCallback(
    (category: CategoriesPicker) => {
      setSelectedCategory(category);
      applyFilterParams({
        sortBy,
        activeTab,
        categoryId: category.id,
        tagId: selectedTagId,
      });
    },
    [activeTab, applyFilterParams, selectedTagId, sortBy],
  );

  const handleTagSelect = useCallback(
    (tag: TrendingTagResponse) => {
      const nextTagId = selectedTagId === tag.id ? undefined : tag.id;
      setSelectedTagId(nextTagId);
      applyFilterParams({
        sortBy,
        activeTab,
        categoryId: selectedCategory.id,
        tagId: nextTagId,
      });
    },
    [activeTab, applyFilterParams, selectedCategory.id, selectedTagId, sortBy],
  );

  const handleTabChange = useCallback(
    (tab: ForumQuestionTab) => {
      setActiveTab(tab);
      applyFilterParams({
        sortBy,
        activeTab: tab,
        categoryId: selectedCategory.id,
        tagId: selectedTagId,
      });
    },
    [applyFilterParams, selectedCategory.id, selectedTagId, sortBy],
  );

  const handleSortByChange = useCallback(
    (value: QuestionSortBy) => {
      setSortBy(value);
      applyFilterParams({
        sortBy: value,
        activeTab,
        categoryId: selectedCategory.id,
        tagId: selectedTagId,
      });
    },
    [activeTab, applyFilterParams, selectedCategory.id, selectedTagId],
  );

  const allQuestion = categories.reduce(
    (acc, category) => acc + (category.questionCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
        }}
      >
        <ForumHeaderNew />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : 0.1,
        }}
      >
        <ForumContentNew
          questions={displayedQuestions}
          categories={[
            {
              id: "all-categories",
              name: "All Categories",
              count: allQuestion,
            },
            ...categories.map((v) => ({
              id: v.id,
              name: v.name,
              count: v.questionCount ?? 0,
            })),
          ]}
          tags={tags}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          sortBy={sortBy}
          setSortBy={handleSortByChange}
          selectedTagId={selectedTagId}
          onTagSelect={handleTagSelect}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
