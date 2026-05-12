import { getUserId } from "~/lib/server/session.server";
import {
  getQuestionById,
  getAnswersByQuestionId,
  getPublicQuestionById,
  getPublicAnswersByQuestionId,
  GetPublicReportType,
} from "~/services/forum/server";
import type {
  Answer,
  GetPublicReportType as GetPublicReportTypeResponse,
  Question,
} from "~/services/forum/forum-types";
import type { Route as ForumDetailRoute } from "project-types/forum/routes/+types/forum.$id";

type ForumDetailLoaderData = {
  question: Question | null;
  bestAnswer: Answer[];
  answers: Answer[];
  userId: string | null;
  reportReasons: GetPublicReportTypeResponse | null;
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

  const url = new URL(request.url);
  const sortBy = url.searchParams.get("sortBy") ?? undefined;

  const [questionResult, answersResult, reportReasonsResult] =
    await Promise.all(
      userId
        ? [
            getQuestionById(request, questionId),
            getAnswersByQuestionId(request, questionId, sortBy),
            GetPublicReportType(request),
          ]
        : [
            getPublicQuestionById(request, questionId),
            getPublicAnswersByQuestionId(request, questionId, sortBy),
            GetPublicReportType(request),
          ],
    );

  return {
    question: questionResult?.data.question ?? null,
    bestAnswer: answersResult?.data.answers.bestAnswer ?? [],
    answers: answersResult?.data.answers.answers ?? [],
    userId: userId ?? null,
    reportReasons:
      (reportReasonsResult?.data as GetPublicReportTypeResponse | null) ?? null,
  } satisfies ForumDetailLoaderData;
}
