import { getUserId } from "~/lib/server/session.server";
import {
  getQuestionById,
  getAnswersByQuestionId,
  getPublicQuestionById,
  getPublicAnswersByQuestionId,
  getPublicCategories,
  getCategories,
  GetPublicReportType,
} from "~/services/forum/server";
import type {
  Answer,
  GetPublicReportType as GetPublicReportTypeResponse,
  Question,
  Category,
} from "~/services/forum/forum-types";
import type { Route as ForumDetailRoute } from "project-types/forum/routes/+types/forum.$id";

type ForumDetailLoaderData = {
  question: Question | null;
  answers: Answer[];
  userId: string | null;
  reportReasons: GetPublicReportTypeResponse;
  categories: Category[];
};

export async function forumDetailLoader({
  request,
  params,
}: ForumDetailRoute.LoaderArgs) {
  const questionId = params.questionId;
  if (!questionId) {
    throw new Error("No question ID provided");
  }

  const userId = await getUserId(request);

const [questionResult, answersResult, reportReasonsResult, categoriesResult] =
    await Promise.all(
      userId
        ? [
            getQuestionById(request, questionId),
            getAnswersByQuestionId(request, questionId),
            GetPublicReportType(request),
            getCategories(request),
          ]
        : [
            getPublicQuestionById(request, questionId),
            getPublicAnswersByQuestionId(request, questionId),
            GetPublicReportType(request),
            getPublicCategories(request),
          ],
    );

  return {
    question: questionResult?.data.question ?? null,
    answers: answersResult?.data.answers ?? [],
    userId: userId ?? null,
    reportReasons: reportReasonsResult.data as GetPublicReportTypeResponse,
    categories: categoriesResult.data.categories ?? [],
  } satisfies ForumDetailLoaderData;
}
