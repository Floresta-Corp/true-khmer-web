import { useLoaderData, useFetcher, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import ForumHeader from "../components/sections/forum-header";
import ForumContent from "../components/sections/forum-content";
import type { Route } from "./+types/forum";
import type { QuestionResponse, GetQuestionsResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import type { DiscussionThreadSectionTab } from "../components/sections/discusssion-thread-section";
import { useState, useEffect, useCallback, useRef } from "react";
import { forumListloader } from "../services/forum.loader";
import { forumListAction } from "../services/forum.action";

const LIMIT = 10;

export const loader = forumListloader;
export const action = forumListAction;

// Map UI tab labels to backend query params
function mapTabToQueryParams(tab: DiscussionThreadSectionTab): {
  sortBy?: string;
  isUnanswered?: boolean;
} {
  switch (tab) {
    case "recent":
      return { sortBy: "newest" };
    case "topRated":
      return { sortBy: "mostVoted" };
    case "unanswered":
      return { isUnanswered: true };
    default:
      return { sortBy: "newest" };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forum & Discussions - True Khmer" },
    {
      name: "description",
      content:
        "Share knowledge, ask questions, and grow with Khmer professionals.",
    },
  ];
}

export default function ForumPage() {
  const { data, categories, tags } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRenderRef = useRef(true);

  // Initialize filters from URL params
  const initialCategoryId = searchParams.get("categoryId");
  const initialTagId = searchParams.get("tagId");
  const initialSortBy = searchParams.get("sortBy");
  const initialIsUnanswered = searchParams.get("isUnanswered") === "true";

  // Map backend params back to UI tab
  const getInitialTab = (): DiscussionThreadSectionTab => {
    if (initialIsUnanswered) return "unanswered";
    if (initialSortBy === "mostVoted") return "topRated";
    if (initialSortBy === "newest") return "recent";
    return "recent";
  };

  const initialCategory =
    initialCategoryId && categories.length > 0
      ? categories.find((c) => c.id === initialCategoryId) || {
          id: "all-categories",
          name: "All Categories",
        }
      : { id: "all-categories", name: "All Categories" };

  const [questionList, setQuestionList] = useState<QuestionResponse[] | undefined>(
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
  const [activeTab, setActiveTab] =
    useState<DiscussionThreadSectionTab>(getInitialTab());
  const prefersReducedMotion = useReducedMotion();

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

      // Map UI tab to backend params
      const queryParams = mapTabToQueryParams(activeTab);
      if (queryParams.sortBy) {
        params.set("sortBy", queryParams.sortBy);
      }
      if (queryParams.isUnanswered) {
        params.set("isUnanswered", "true");
      }

      return `/forum?${params.toString()}`;
    },
    [activeTab, selectedCategory.id, selectedTagId],
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
      | GetQuestionsResponse
      | undefined;
    if (fetcherData) {
      const fetchedQuestions = fetcherData.questions;
      setQuestionList((prev) => {
        const existingIds = new Set((prev || []).map((q) => q.id));
        const newQuestions = fetchedQuestions.filter(
          (q: QuestionResponse) => !existingIds.has(q.id),
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

      // Map current tab to backend params
      const queryParams = mapTabToQueryParams(activeTab);
      if (queryParams.sortBy) {
        nextParams.set("sortBy", queryParams.sortBy);
      }
      if (queryParams.isUnanswered) {
        nextParams.set("isUnanswered", "true");
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
    [activeTab, selectedTagId, setSearchParams],
  );

  const handleTagSelect = useCallback((tagId: string | undefined) => {
    setSelectedTagId((prev) => (prev === tagId ? undefined : tagId));
  }, []);

  const handleTabChange = useCallback(
    (tab: DiscussionThreadSectionTab) => {
      setActiveTab(tab);

      const nextParams = new URLSearchParams();

      // Map new tab to backend params
      const queryParams = mapTabToQueryParams(tab);
      if (queryParams.sortBy) {
        nextParams.set("sortBy", queryParams.sortBy);
      }
      if (queryParams.isUnanswered) {
        nextParams.set("isUnanswered", "true");
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
    [selectedCategory.id, selectedTagId, setSearchParams],
  );

  const handleSearch = (query: string) => {
    // TODO: Filter discussions based on search query
  };

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
        <ForumHeader onSearch={handleSearch} categories={categories} />
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
        <ForumContent
          tags={tags}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategorySelect}
          selectedTagId={selectedTagId}
          setSelectedTagId={handleTagSelect}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          data={{
            hasMore: hasMore,
            questions: questionList,
          }}
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
          ]} // Ensure "All Categories" is included
          onLoadMore={handleLoadMore}
          isLoading={fetcher.state === "loading"}
        />
      </motion.div>
    </div>
  );
}
