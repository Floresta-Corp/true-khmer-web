import { redirect, useLoaderData, useFetcher } from "react-router";
import { motion } from "framer-motion";
import ForumHeader from "../components/sections/ForumHeader";
import ForumContent from "../components/sections/ForumContent";
import type { Route } from "./+types/forum";
import {
  createForumQuestion,
  getCategories,
  getQuestionPagination,
} from "~/services/forum/forum.server";
import { parseCreateForumPostForm } from "~/services/forum/utils";
import { useReducedMotion } from "framer-motion";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import { getSession, destroySession } from "~/lib/server/session.server";
import type {
  CategoriesPicker,
  GetQuestionpaginationResponse,
  Question,
} from "~/services/forum/types";
import { useState, useEffect, useCallback } from "react";
import {
  getOptionalUser,
  type AuthenticatedUser,
} from "~/lib/server/route-guards.server";

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
    const categoryId = url.searchParams.get("categoryId");
    const limit = url.searchParams.get("limit");
    const [result, categoriesResult, user] = await Promise.all([
      getQuestionPagination(request, {
        limit: limit ? Number(limit) : LIMIT,
        categoryId: categoryId || undefined,
        cursor: cursor || undefined,
      }),
      getCategories(request),
      getOptionalUser(request),
    ]);

    return {
      data: result?.data,
      categories: categoriesResult?.data?.categories || [],
      user: (user.user as AuthenticatedUser) || null,
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
  const payload = parseCreateForumPostForm(formData);
  const result = await createForumQuestion(request, payload);
  return result;
}

export default function ForumPage() {
  const { data, categories, user } = useLoaderData<typeof loader>();
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
  const prefersReducedMotion = useReducedMotion();

  // Sync local state from fresh loader data after revalidation
  useEffect(() => {
    if (data?.questions) {
      setQuestionList(data.questions);
      setHasMore(data.pagination?.hasMore);
      setNextCursor(data.pagination?.nextCursor);
    }
  }, [data]);

  useEffect(() => {
    if (selectedCategory.id) {
      setQuestionList([]);
      setHasMore(undefined);
      setNextCursor(undefined);

      if (selectedCategory.id !== "all-categories") {
        fetcher.load(`/forum?limit=${LIMIT}&categoryId=${selectedCategory.id}`);
      } else {
        fetcher.load(`/forum?limit=${LIMIT}`);
      }
    }
  }, [selectedCategory.id]);

  useEffect(() => {
    const fetcherData = fetcher.data?.data as
      | GetQuestionpaginationResponse
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
      if (selectedCategory && selectedCategory.id !== "all-categories") {
        fetcher.load(
          `/forum?limit=${LIMIT}&cursor=${nextCursor}&categoryId=${selectedCategory.id}`,
        );
      } else {
        fetcher.load(`/forum?limit=${LIMIT}&cursor=${nextCursor}`);
      }
    }
  }, [
    questionList,
    fetcher.state,
    fetcher.load,
    hasMore,
    nextCursor,
    selectedCategory,
  ]);

  const handleSearch = (query: string) => {
    // TODO: Filter discussions based on search query
    console.log("Search:", query);
  };

  console.log(fetcher.state);

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
          user={user as AuthenticatedUser}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          data={{
            hasMore: hasMore,
            questions: questionList,
          }}
          categories={[
            { id: "all-categories", name: "All Categories" },
            ...categories.map((v) => ({ id: v.id, name: v.name })),
          ]} // Ensure "All Categories" is included
          onLoadMore={handleLoadMore}
          isLoading={fetcher.state === "loading"}
        />
      </motion.div>
    </div>
  );
}
