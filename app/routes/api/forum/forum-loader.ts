import {
  getQuestionPagination,
  getCategories,
  getTrendingTags,
  getPublicQuestionPagination,
  getPublicCategories,
  getPublicTrendingTags,
  getMyAnswers,
  GetPublicReportType,
} from "~/services/forum/server";
import {
  questionSortBySchema,
  type Answer,
  type Category,
  type GetPublicReportType as GetPublicReportTypeResponse,
  type GetQuestionPaginationResponse,
  type Tag,
} from "~/services/forum/forum-types";
import type { Route as ForumRoute } from "../../../features/forum/routes/+types/forum";
import { getUserId } from "../../../lib/server/session.server";

const LIMIT = 5;
type ForumListLoaderData = {
  data: GetQuestionPaginationResponse;
  categories: Category[];
  userId: string | null;
  tags: Tag[];
  answers: Answer[];
  reportReasons: GetPublicReportTypeResponse;
};

export async function forumListloader({ request }: ForumRoute.LoaderArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const tagId = url.searchParams.get("tagId");
  const categoryId = url.searchParams.get("categoryId");
  const limit = url.searchParams.get("limit");
  const rawSortBy = url.searchParams.get("sortBy");
  const parsedSortBy = questionSortBySchema.safeParse(rawSortBy);
  const sortBy = parsedSortBy.success ? parsedSortBy.data : "recent";

  const userId = await getUserId(request);

  const [question, categoriesResult, tags, reportReasons] = userId
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
      GetPublicReportType(request),
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
      GetPublicReportType(request),
    ]);

  let answers: Answer[] = [];

  if (rawSortBy === "myActivity" && userId) {
    const queryAnswer = await getMyAnswers(request);
    answers = queryAnswer?.data?.answers || [];
  }

  return {
    data: question.data,
    categories: categoriesResult.data.categories,
    userId: userId || null,
    tags: tags.data.tags,
    answers,
    reportReasons: reportReasons.data as GetPublicReportTypeResponse,
  } satisfies ForumListLoaderData;
}
