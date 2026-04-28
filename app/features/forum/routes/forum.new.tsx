import { useLoaderData, useFetcher, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import type {
  CategoriesPicker,
  GetQuestionPaginationResponse,
  Question,
  QuestionSortBy,
  Tag,
} from "~/services/forum/forum-types";
import { useState, useEffect, useCallback, useRef } from "react";
import { forumListloader } from "~/routes/api/forum/forum-loader";
import { questionSortBySchema } from "~/services/forum/forum-types";
import ForumHeaderNew from "../components/sections/forum-header-new";
import ForumContentNew, {
  type ForumQuestionTab,
} from "../components/sections/forum-content-new";
import { forumListAction } from "~/routes/api/forum/forum-action";

const LIMIT = 10;

export const loader = forumListloader;
export const action = forumListAction;

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

export default function ForumNewPage() {
  const { data, categories, tags } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRenderRef = useRef(true);

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

  const [questionList, setQuestionList] = useState<Question[] | undefined>(
    data?.questions,
  );
  const [hasMore, setHasMore] = useState<boolean | undefined>(
    data?.pagination?.hasMore,
  );
  const [nextCursor, setNextCursor] = useState<string | null | undefined>(
    data?.pagination?.nextCursor,
  );
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesPicker>(initialCategory);
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(
    initialTagId || undefined,
  );
  const [sortBy, setSortBy] = useState<QuestionSortBy>(
    initialSortBy.success ? initialSortBy.data : "mostRelevant",
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
      const params = new URLSearchParams({ limit: String(LIMIT) });

      if (cursor) {
        params.set("cursor", cursor);
      }

      if (selectedCategory.id !== "all-categories") {
        params.set("categoryId", selectedCategory.id);
      }

      if (selectedTagId) {
        params.set("tagId", selectedTagId);
      }

      params.set("sortBy", sortBy);

      const { isTrending, isUnanswered } = getTabQueryFlags(activeTab);

      if (isTrending) {
        params.set("isTrending", isTrending);
      }

      if (isUnanswered) {
        params.set("isUnanswered", isUnanswered);
      }

      return `/forum?${params.toString()}`;
    },
    [activeTab, selectedCategory.id, selectedTagId, sortBy],
  );

  // Sync local state from fresh loader data after revalidation
  useEffect(() => {
    if (data?.questions) {
      setQuestionList(data.questions);
      setHasMore(data.pagination?.hasMore);
      setNextCursor(data.pagination?.nextCursor ?? undefined);
    }
  }, [data]);

  // Fetch when filters change (but skip the initial mount)
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return; // Skip initial fetch since loader already hydrated
    }
    setQuestionList([]);
    setHasMore(undefined);
    setNextCursor(undefined);
    fetcher.load(buildForumQuery());
  }, [buildForumQuery]);

  useEffect(() => {
    const fetcherData = fetcher.data?.data as
      | GetQuestionPaginationResponse
      | undefined;
    if (fetcherData) {
      const fetchedQuestions = fetcherData.questions;
      setQuestionList((prev) => {
        const existingIds = new Set((prev || []).map((q) => q.id));
        const newQuestions = fetchedQuestions.filter(
          (q: Question) => !existingIds.has(q.id),
        );
        return [...(prev || []), ...newQuestions];
      });
      const pagination = fetcherData.pagination;
      setHasMore(pagination.hasMore);
      setNextCursor(pagination.nextCursor ?? undefined);
    }
  }, [fetcher.data?.data]);

  const handleLoadMore = useCallback(() => {
    if (!questionList || questionList.length === 0) return;
    if (fetcher.state === "loading") return;
    if (hasMore === false) return;

    if (nextCursor) {
      fetcher.load(buildForumQuery(nextCursor));
    }
  }, [
    questionList,
    fetcher.state,
    fetcher.load,
    hasMore,
    nextCursor,
    buildForumQuery,
  ]);

  const handleCategorySelect = useCallback(
    (category: CategoriesPicker) => {
      setSelectedCategory(category);

      const nextParams = new URLSearchParams();
      nextParams.set("sortBy", sortBy);

      const { isTrending, isUnanswered } = getTabQueryFlags(activeTab);

      if (isTrending) {
        nextParams.set("isTrending", isTrending);
      }

      if (isUnanswered) {
        nextParams.set("isUnanswered", isUnanswered);
      }

      if (category.id !== "all-categories") {
        nextParams.set("categoryId", category.id);
      }

      if (selectedTagId) {
        nextParams.set("tagId", selectedTagId);
      }

      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [activeTab, selectedTagId, setSearchParams, sortBy],
  );

  const handleTagSelect = useCallback(
    (tag: Tag) => {
      const nextTagId = selectedTagId === tag.id ? undefined : tag.id;
      setSelectedTagId(nextTagId);

      const nextParams = new URLSearchParams();
      nextParams.set("sortBy", sortBy);

      const { isTrending, isUnanswered } = getTabQueryFlags(activeTab);

      if (isTrending) {
        nextParams.set("isTrending", isTrending);
      }

      if (isUnanswered) {
        nextParams.set("isUnanswered", isUnanswered);
      }

      if (selectedCategory.id !== "all-categories") {
        nextParams.set("categoryId", selectedCategory.id);
      }

      if (nextTagId) {
        nextParams.set("tagId", nextTagId);
      }

      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [activeTab, selectedCategory.id, selectedTagId, setSearchParams, sortBy],
  );

  const handleTabChange = useCallback(
    (tab: ForumQuestionTab) => {
      setActiveTab(tab);

      const nextParams = new URLSearchParams();
      nextParams.set("sortBy", sortBy);

      const { isTrending, isUnanswered } = getTabQueryFlags(tab);

      if (isTrending) {
        nextParams.set("isTrending", isTrending);
      }

      if (isUnanswered) {
        nextParams.set("isUnanswered", isUnanswered);
      }

      if (selectedCategory.id !== "all-categories") {
        nextParams.set("categoryId", selectedCategory.id);
      }

      if (selectedTagId) {
        nextParams.set("tagId", selectedTagId);
      }

      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [selectedCategory.id, selectedTagId, setSearchParams, sortBy],
  );

  const handleSortByChange = useCallback(
    (value: QuestionSortBy) => {
      setSortBy(value);

      const nextParams = new URLSearchParams();
      nextParams.set("sortBy", value);

      const { isTrending, isUnanswered } = getTabQueryFlags(activeTab);

      if (isTrending) {
        nextParams.set("isTrending", isTrending);
      }

      if (isUnanswered) {
        nextParams.set("isUnanswered", isUnanswered);
      }

      if (selectedCategory.id !== "all-categories") {
        nextParams.set("categoryId", selectedCategory.id);
      }

      if (selectedTagId) {
        nextParams.set("tagId", selectedTagId);
      }

      setSearchParams(nextParams, {
        replace: true,
        preventScrollReset: true,
      });
    },
    [activeTab, selectedCategory.id, selectedTagId, setSearchParams],
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
          questions={questionList}
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
          isLoading={fetcher.state === "loading"}
        />
      </motion.div>
    </div>
  );
}
