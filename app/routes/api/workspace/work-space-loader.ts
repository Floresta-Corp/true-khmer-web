import {
  getCategories,
  myForumAnswer,
  myForumQuestion,
} from "~/services/forum/server";
import type {
  Question,
  DiscussionsListResponse,
} from "~/services/forum/forum-types";
import type { Route } from "project-types/workspace/routes/+types/workspace";
import type { BasicJoinType } from "~/services/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { MyAnswerParams } from "~/services/forum/server/forum-answer.server";
import type { GetMyAnswersResponse } from "~/types/api-client";

export type MyWorkSpaceLoaderData = {
  questions: Question[];
  answers: GetMyAnswersResponse;
  categories: BasicJoinType[];
  userId: string | null;
};

export async function workSpaceLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  const sortBy = url.searchParams.get("sortBy") as
    | MyAnswerParams["sortBy"]
    | null;
  const cursor = url.searchParams.get("cursor") || undefined;

  const answerParams: MyAnswerParams = {
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(cursor && { cursor }),
    limit: 10,
  };

  const [qa, an, ca] = await Promise.all([
    myForumQuestion(request),
    myForumAnswer(request, answerParams),
    getCategories(request),
  ]);

  const questions: Question[] = qa?.data?.questions || [];
  const answers: GetMyAnswersResponse = an.data;

  return withAuthData(auth, {
    questions,
    answers,
    userId: userId || null,
    categories: ca?.data?.categories || [],
  } satisfies MyWorkSpaceLoaderData);
}
