import { getUserId } from "~/lib/server/session.server";
import { questionSortBySchema } from "~/features/forum/types";
import type { CategoryResponse, GetQuestionsResponse } from "~/types/api-client";
import {
  getCategories,
  getPublicCategories,
  getPublicQuestionPagination,
  getQuestionPagination,
} from "~/routes/api/forum/forum.server";
import type { Route as ForumSearchRoute } from "project-types/forum/route/+types/forum.search";

type ForumSearchLoaderData = {
  data: GetQuestionsResponse;
  categories: CategoryResponse[];
  userId: string | null;
};

export async function forumSearchLoader({
  request,
}: ForumSearchRoute.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() || "";
  const cursor = searchParams.get("cursor");
  const tagId = searchParams.get("tagId");
  const categoryId = searchParams.get("categoryId");
  const limit = searchParams.get("limit");
  const rawSortBy = searchParams.get("sortBy");
  const parsedSortBy = questionSortBySchema.safeParse(rawSortBy);
  const sortBy = parsedSortBy.success ? parsedSortBy.data : "mostRelevant";
  const isUnanswered = searchParams.get("isUnanswered") === "true";
  const isTrending = searchParams.get("isTrending") === "true";
  const userId = await getUserId(request);

  // Check if any filter params are present (excluding cursor and limit)
  const hasFilters = !!(
    search ||
    categoryId ||
    tagId ||
    isUnanswered ||
    isTrending
  );

  // Only fetch categories - data will be fetched client-side when filters are applied
  const categories = userId
    ? await getCategories(request)
    : await getPublicCategories(request);

  // If no filters and not loading more (no cursor), skip fetching questions
  const question =
    hasFilters || cursor
      ? userId
        ? await getQuestionPagination(request, {
            limit: limit ? Number(limit) : 10,
            categoryId: categoryId || undefined,
            tagId: tagId || undefined,
            cursor: cursor || undefined,
            sortBy,
            isUnanswered,
            isTrending,
            search: search || undefined,
          })
        : await getPublicQuestionPagination(request, {
            limit: limit ? Number(limit) : 10,
            categoryId: categoryId || undefined,
            tagId: tagId || undefined,
            cursor: cursor || undefined,
            sortBy,
            isUnanswered,
            isTrending,
            search: search || undefined,
          })
      : null;

  const emptyResponse: GetQuestionsResponse = {
    ok: true,
    questions: [],
    pagination: { limit: 10, hasMore: false, nextCursor: null },
  };

  return {
    data: question?.data ?? emptyResponse,
    categories: categories.data.categories,
    userId: userId || null,
  } satisfies ForumSearchLoaderData;
}
