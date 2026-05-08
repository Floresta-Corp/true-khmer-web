import {
  myPublishForumQuestion,
  myPublishForumAnswer,
} from "~/services/forum/server"; // adjust import path
import type {
  Question,
  Answer,
  MyAnswerItem,
} from "~/services/forum/forum-types"; // adjust types
import { getUserId } from "~/lib/server/session.server";
import type { Route } from "../../+types";

type MyPublishLoaderData = {
  questions: Question[];
  answers: MyAnswerItem[];
  userId: string | null;
};

export async function workSpaceLoader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);

  const [qa, an] = userId
    ? await Promise.all([
        myPublishForumQuestion(request),
        myPublishForumAnswer(request),
      ])
    : await Promise.all([
        myPublishForumQuestion(request),
        myPublishForumAnswer(request),
      ]);

  const questions: Question[] = qa?.data?.questions || [];
  const answers: MyAnswerItem[] = an?.data?.answers || [];

  return {
    questions,
    answers,
    userId: userId || null,
  } satisfies MyPublishLoaderData;
}
