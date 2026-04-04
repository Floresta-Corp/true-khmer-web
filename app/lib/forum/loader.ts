import { getQuestionPagination, getCategories, getTrendingTags, getPublicQuestionPagination, getPublicCategories, getPublicTrendingTags } from "~/services/forum/server";
import type { Route } from "../../+types/root";
import { getUserId } from "../server/session.server";
import { questionSortBySchema } from "~/services/forum/types";

const LIMIT = 10;

export async function forumListloader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const tagId = url.searchParams.get("tagId");
  const categoryId = url.searchParams.get("categoryId");
  const limit = url.searchParams.get("limit");
  const rawSortBy = url.searchParams.get("sortBy");
  const parsedSortBy = questionSortBySchema.safeParse(rawSortBy);
  const sortBy = parsedSortBy.success ? parsedSortBy.data : "recent";

  const userId = await getUserId(request);

  const [question, categoriesResult, tags] = userId
    ? await Promise.all([
      getQuestionPagination(request, {
        limit: limit ? Number(limit) : LIMIT,
        categoryId: categoryId || undefined,
        tagId: tagId || undefined,
        cursor: cursor || undefined,
        sortBy,
      }),
      getCategories(request),
      getTrendingTags(request),
    ])
    : await Promise.all([
      getPublicQuestionPagination(request, {
        limit: limit ? Number(limit) : LIMIT,
        categoryId: categoryId || undefined,
        tagId: tagId || undefined,
        cursor: cursor || undefined,
        sortBy,
      }),
      getPublicCategories(request),
      getPublicTrendingTags(request),
    ]);

  return {
    data: question?.data,
    categories: categoriesResult?.data?.categories || [],
    user: userId,
    tags: tags?.data?.tags || [],
  };
}