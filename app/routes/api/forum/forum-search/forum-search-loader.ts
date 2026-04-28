import { getUserId } from "~/lib/server/session.server";
import {
  questionSortBySchema,
  type Category,
  type GetQuestionPaginationResponse,
} from "~/services/forum/forum-types";
import {
  getCategories,
  getPublicCategories,
  getPublicQuestionPagination,
  getQuestionPagination,
} from "~/services/forum/server";
import type { Route as ForumSearchRoute } from "project-types/forum/routes/+types/forum.search";

type ForumSearchLoaderData = {
  data: GetQuestionPaginationResponse;
  categories: Category[];
  userId: string | null;
};

export async function ForumSearchLoader({
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

  const [question, categories] = userId
    ? await Promise.all([
        getQuestionPagination(request, {
          limit: limit ? Number(limit) : 10,
          categoryId: categoryId || undefined,
          tagId: tagId || undefined,
          cursor: cursor || undefined,
          sortBy,
          isUnanswered,
          isTrending,
          search: search || undefined,
        }),
        getCategories(request),
      ])
    : await Promise.all([
        getPublicQuestionPagination(request, {
          limit: limit ? Number(limit) : 10,
          categoryId: categoryId || undefined,
          tagId: tagId || undefined,
          cursor: cursor || undefined,
          sortBy,
          isUnanswered,
          isTrending,
          search: search || undefined,
        }),
        getPublicCategories(request),
      ]);

  return {
    data: question.data,
    categories: categories.data.categories,
    userId: userId || null,
  } satisfies ForumSearchLoaderData;
}
