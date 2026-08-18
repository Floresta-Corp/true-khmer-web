import {
  getQuestionPagination,
  getCategories,
  getTrendingTags,
  getPublicQuestionPagination,
  getPublicCategories,
  getPublicTrendingTags,
  getMyAnswers,
  GetPublicReportType,
  myForumQuestion,
  myForumAnswer,
} from "~/api/forum/forum.server";
import { questionSortBySchema } from "~/features/forum/types";
import type {
  AnswerResponse,
  CategoryResponse,
  GetReportingTypesResponse,
  GetQuestionsResponse,
  TrendingTagResponse,
} from "~/types/api-client";
import type { Route as ForumRoute } from "project-types/forum/route/+types/forum.new";
import { getUserId } from "../../../lib/server/session.server";

const LIMIT = 10;

async function getReportReasons(request: Request) {
  try {
    const result = await GetPublicReportType(request);
    return (result?.data as GetReportingTypesResponse | null) ?? null;
  } catch (error) {
    console.error("Failed to load forum report reasons", error);
    return null;
  }
}

type ForumListLoaderData = {
  data: GetQuestionsResponse;
  categories: CategoryResponse[];
  userId: string | null;
  tags: TrendingTagResponse[];
  answers: AnswerResponse[];
  reportReasons: GetReportingTypesResponse | null;
  questionCount: number;
  answerCount: number;
};

export async function forumListloader({ request }: ForumRoute.LoaderArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const tagId = url.searchParams.get("tagId");
  const categoryId = url.searchParams.get("categoryId");
  const limit = url.searchParams.get("limit");
  const isTrending = url.searchParams.get("isTrending") === "true";
  const isUnanswered = url.searchParams.get("isUnanswered") === "true";
  const rawSortBy = url.searchParams.get("sortBy");
  const parsedSortBy = questionSortBySchema.safeParse(rawSortBy);
  const sortBy = parsedSortBy.success ? parsedSortBy.data : undefined;

  const userId = await getUserId(request);

  const [question, categoriesResult, tags, reportReasons] = userId
    ? await Promise.all([
        getQuestionPagination(request, {
          limit: limit ? Number(limit) : LIMIT,
          categoryId: categoryId || undefined,
          tagId: tagId || undefined,
          cursor: cursor || undefined,
          sortBy,
          isTrending,
          isUnanswered,
        }),
        getCategories(request),
        getTrendingTags(request),
        getReportReasons(request),
      ])
    : await Promise.all([
        getPublicQuestionPagination(request, {
          limit: limit ? Number(limit) : LIMIT,
          categoryId: categoryId || undefined,
          tagId: tagId || undefined,
          cursor: cursor || undefined,
          sortBy,
          isTrending,
          isUnanswered,
        }),
        getPublicCategories(request),
        getPublicTrendingTags(request),
        getReportReasons(request),
      ]);

  let answers: AnswerResponse[] = [];

  if (rawSortBy === "myActivity" && userId) {
    const queryAnswer = await getMyAnswers(request);
    answers = queryAnswer?.data?.answers?.answers ?? [];
  }

  const [qa, an] = userId
    ? await Promise.all([myForumQuestion(request), myForumAnswer(request)])
    : [null, null];
  const questionCount = qa?.data?.questions?.length ?? 0;
  const answerCount = an?.data?.totalAnswers ?? 0;

  return {
    data: question.data,
    categories: categoriesResult.data.categories,
    userId: userId || null,
    tags: tags.data.tags,
    answers,
    reportReasons,
    questionCount,
    answerCount,
  } satisfies ForumListLoaderData;
}
