import { redirect, useLoaderData, useFetcher } from "react-router";
import { motion } from "framer-motion";
import ForumHeader from "../components/sections/ForumHeader";
import ForumContent from "../components/sections/ForumContent";
import type { Route } from "./+types/forum";
import {
  createForumQuestion,
  getCategories,
  getQuestionPagination,
  getTrendingTags,
  updateForumQuestion,
} from "~/services/forum/server";
import { validateCreateForumPostForm } from "~/services/forum/utils";
import { useReducedMotion } from "framer-motion";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import { getSession, destroySession } from "~/lib/server/session.server";
import type {
  CategoriesPicker,
  GetQuestionPaginationResponse,
  Question,
} from "~/services/forum/types";
import { useState, useEffect, useCallback } from "react";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import {
  deleteQuestionAction,
  parseVoteAction,
  submitVoteAction,
} from "~/services/forum/action";

const LIMIT = 5;

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

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const tagId = url.searchParams.get("tagId");
    const categoryId = url.searchParams.get("categoryId");
    const limit = url.searchParams.get("limit");
    const [result, categoriesResult, user, tags] = await Promise.all([
      getQuestionPagination(request, {
        limit: limit ? Number(limit) : LIMIT,
        categoryId: categoryId || undefined,
        tagId: tagId || undefined,
        cursor: cursor || undefined,
      }),
      getCategories(request),
      getOptionalUser(request),
      getTrendingTags(request),
    ]);

    return {
      data: result?.data,
      categories: categoriesResult?.data?.categories || [],
      user: user.user,
      tags: tags?.data?.tags || [],
    };
  } catch (error) {
    console.error({ error });
    if (error instanceof AuthSessionExpiredError) {
      const session = await getSession(request);
      throw redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
      });
    }
    throw error;
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();

  if (actionType === "vote-question") {
    const parsedVoteAction = parseVoteAction(formData);
    if (!parsedVoteAction.ok) {
      return {
        ok: false,
        message: parsedVoteAction.message,
      };
    }
    return submitVoteAction(request, parsedVoteAction);
  }

  if (method === "DELETE") {
    return deleteQuestionAction(request, formData);
  }

  const validation = validateCreateForumPostForm(formData);
  if (!validation.success) {
    return {
      ok: false,
      message: validation.message,
      fieldErrors: validation.fieldErrors,
    };
  }

  if (method === "PATCH") {
    const questionId = String(formData.get("questionId") ?? "").trim();
    if (!questionId) {
      return {
        ok: false,
        message: "Question ID is required for updating.",
      };
    }

    return updateForumQuestion(request, questionId, validation.data);
  }

  return createForumQuestion(request, validation.data);
}

export default function ForumPage() {
  const { data, categories, user, tags } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof loader>();
  const [questionList, setQuestionList] = useState<Question[] | undefined>(
    data?.questions,
  );
  const [hasMore, setHasMore] = useState<boolean | undefined>(
    data?.pagination?.hasMore,
  );
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    data?.pagination?.nextCursor,
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoriesPicker>({
    id: "all-categories",
    name: "All Categories",
  });
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(
    undefined,
  );
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

      return `/forum?${params.toString()}`;
    },
    [selectedCategory.id, selectedTagId],
  );

  // Sync local state from fresh loader data after revalidation
  useEffect(() => {
    if (data?.questions) {
      setQuestionList(data.questions);
      setHasMore(data.pagination?.hasMore);
      setNextCursor(data.pagination?.nextCursor);
    }
  }, [data]);

  useEffect(() => {
    setQuestionList([]);
    setHasMore(undefined);
    setNextCursor(undefined);
    fetcher.load(buildForumQuery());
  }, [fetcher, buildForumQuery]);

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
      setNextCursor(pagination.nextCursor);
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

  const handleCategorySelect = useCallback((category: CategoriesPicker) => {
    setSelectedCategory(category);
  }, []);

  const handleTagSelect = useCallback((tagId: string | undefined) => {
    setSelectedTagId((prev) => (prev === tagId ? undefined : tagId));
  }, []);

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
          user={user}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategorySelect}
          selectedTagId={selectedTagId}
          setSelectedTagId={handleTagSelect}
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
