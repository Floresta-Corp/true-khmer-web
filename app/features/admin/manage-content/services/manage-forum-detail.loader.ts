import type { Route } from "project-types/admin/manage-content/route/+types/manage-forum.$questionId";

import {
  getAdminForumQuestionAnswers,
  getAdminForumQuestionById,
} from "~/api/admin/manage-forum/manage-forum.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { answerSortBySchema } from "~/features/admin/manage-content/types";
import type { AnswerResponse, QuestionResponse } from "~/types/api-client";

export type ManageForumDetailLoaderData = {
  question: QuestionResponse;
  answers: Promise<AnswerResponse[]>;
};

export async function manageForumDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const questionId = params.questionId;
  if (!questionId) {
    throw new Response("Question ID is required", { status: 400 });
  }

  const url = new URL(request.url);
  const parsedSortBy = answerSortBySchema.safeParse(
    url.searchParams.get("sortBy"),
  );

  const answers = getAdminForumQuestionAnswers(
    request,
    auth.accessToken,
    questionId,
    parsedSortBy.success ? parsedSortBy.data : undefined,
  ).then((result) => result?.answers?.answers ?? []);
  answers.catch(() => []);

  let question: QuestionResponse | undefined;
  try {
    const questionResult = await getAdminForumQuestionById(
      request,
      auth.accessToken,
      questionId,
    );
    question = questionResult?.question;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Question not found", { status: 404 });
    }
    throw error;
  }

  if (!question) {
    throw new Response("Question not found", { status: 404 });
  }

  return withAuthData(auth, {
    question,
    answers,
  } satisfies ManageForumDetailLoaderData);
}
