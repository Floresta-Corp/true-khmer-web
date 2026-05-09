import { myForumAnswer, myForumQuestion } from "~/services/forum/server";
import type { Question, MyAnswerItem } from "~/services/forum/forum-types";
import { getUserId } from "~/lib/server/session.server";
import type { Route } from "../../+types";

type MyWorkSpaceLoaderData = {
  questions: Question[];
  answers: MyAnswerItem[];
  userId: string | null;
};

export async function workSpaceLoader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);

  if (!userId) {
    return {
      questions: [],
      answers: [],
      userId: null,
    } satisfies MyWorkSpaceLoaderData;
  }
  const [qa, an] = await Promise.all([
    myForumQuestion(request),
    myForumAnswer(request),
  ]);

  const questions: Question[] = qa?.data?.questions || [];
  const answers: MyAnswerItem[] = an?.data?.answers || [];

  return {
    questions,
    answers,
    userId: userId || null,
  } satisfies MyWorkSpaceLoaderData;
}
