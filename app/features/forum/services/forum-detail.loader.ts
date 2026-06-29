import { getUserId } from "~/lib/server/session.server";
import {
  getQuestionById,
  getAnswersByQuestionId,
  getPublicQuestionById,
  getPublicAnswersByQuestionId,
  GetPublicReportType,
} from "~/api/forum/forum.server";
import type {
  AnswerResponse,
  QuestionResponse,
  GetReportingTypesResponse,
} from "~/types/api-client";
import type { Route as ForumDetailRoute } from "project-types/forum/route/+types/forum.$id";

type ForumDetailLoaderData = {
  question: QuestionResponse | null;
  bestAnswer: AnswerResponse[];
  answers: AnswerResponse[];
  userId: string | null;
  reportReasons: GetReportingTypesResponse | null;
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
      (reportReasonsResult?.data as GetReportingTypesResponse | null) ?? null,
  } satisfies ForumDetailLoaderData;
}
