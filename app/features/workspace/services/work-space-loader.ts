import {
  getCategories,
  myForumAnswer,
  myForumQuestion,
} from "~/api/forum/forum.server";
import type { Route } from "project-types/workspace/route/+types/workspace";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { MyAnswerParams } from "~/api/forum/forum.server";
import type {
  GetMyAnswersResponse,
  GetMyQuestionsResponse,
} from "~/types/api-client";
import type { MyWorkSpaceLoaderData } from "../types";

export type { MyWorkSpaceLoaderData } from "../types";

export async function workSpaceLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  const url = new URL(request.url);
  const tab = url.searchParams.get("tab");
  const activeTab = tab === "answers" ? "answers" : "questions";

  const search = url.searchParams.get("search") || undefined;
  // Only accept sort values the answers API understands. A question-tab sort
  // (e.g. "mostVoted") lingering in the URL must not reach the answers fetch,
  // or the API rejects it with "API request failed".
  const ANSWER_SORT_VALUES: ReadonlyArray<
    NonNullable<MyAnswerParams["sortBy"]>
  > = ["lastActivity", "mostReplies"];
  const rawSortBy = url.searchParams.get("sortBy");
  const sortBy = ANSWER_SORT_VALUES.includes(
    rawSortBy as NonNullable<MyAnswerParams["sortBy"]>,
  )
    ? (rawSortBy as NonNullable<MyAnswerParams["sortBy"]>)
    : undefined;
  const cursor = url.searchParams.get("cursor") || undefined;

  // Search/sort params belong to whichever tab is active. Questions are
  // filtered client-side, so only forward the params to the answers fetch
  // when the answers tab is active — otherwise answers get the defaults.
  const answerParams: MyAnswerParams =
    activeTab === "answers"
      ? {
          ...(search && { search }),
          ...(sortBy && { sortBy }),
          ...(cursor && { cursor }),
          limit: 10,
        }
      : { limit: 10 };

  const [qa, an, ca] = await Promise.all([
    myForumQuestion(request),
    myForumAnswer(request, answerParams),
    getCategories(request),
  ]);

  const questions: GetMyQuestionsResponse = qa?.data;
  const answers: GetMyAnswersResponse = an.data;

  return withAuthData(auth, {
    questions,
    answers,
    userId: userId || null,
    categories: ca?.data?.categories || [],
  } satisfies MyWorkSpaceLoaderData);
}
