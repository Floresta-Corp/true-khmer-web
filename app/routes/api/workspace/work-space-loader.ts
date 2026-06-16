import {
  getCategories,
  myForumAnswer,
  myForumQuestion,
} from "~/services/forum/server";
import type { Question, MyAnswerItem } from "~/services/forum/forum-types";
import type { Route } from "project-types/workspace/routes/+types/workspace";
import type { BasicJoinType } from "~/services/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";

export type MyWorkSpaceLoaderData = {
  questions: Question[];
  answers: MyAnswerItem[];
  categories: BasicJoinType[];
  userId: string | null;
};

export async function workSpaceLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  const [qa, an, ca] = await Promise.all([
    myForumQuestion(request),
    myForumAnswer(request),
    getCategories(request),
  ]);

  const questions: Question[] = qa?.data?.questions || [];
  const answers: MyAnswerItem[] = an?.data?.answers || [];

  return withAuthData(auth, {
    questions,
    answers,
    userId: userId || null,
    categories: ca?.data?.categories || [],
  } satisfies MyWorkSpaceLoaderData);
}
