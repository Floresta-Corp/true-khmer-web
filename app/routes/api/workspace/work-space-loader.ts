import {
  getCategories,
  myForumAnswer,
  myForumQuestion,
} from "~/services/forum/server";
import type { Question, MyAnswerItem } from "~/services/forum/forum-types";
import { getUserId } from "~/lib/server/session.server";
import type { Route } from "project-types/workspace/routes/+types/workspace";
import type { BasicJoinType } from "~/services/types";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";

type MyWorkSpaceLoaderData = {
  questions: Question[];
  answers: MyAnswerItem[];
  categories?: BasicJoinType[];
  userId: string | null;
};

export async function workSpaceLoader({ request }: Route.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);

  if (!userId) {
    return {
      questions: [],
      answers: [],
      userId: null,
    } satisfies MyWorkSpaceLoaderData;
  }
  const [qa, an, ca] = await Promise.all([
    myForumQuestion(request),
    myForumAnswer(request),
    getCategories(request),
  ]);

  const questions: Question[] = qa?.data?.questions || [];
  const answers: MyAnswerItem[] = an?.data?.answers || [];

  return {
    questions,
    answers,
    userId: userId || null,
    categories: ca?.data?.categories || [],
  } satisfies MyWorkSpaceLoaderData;
}
