import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { CreateForumPostInput, GetQuestionResponse } from "./types";

export async function createForumQuestion(
  request: Request,
  payload: CreateForumPostInput,
) {
  const result = await apiRequestWithSession<
    GetQuestionResponse,
    CreateForumPostInput
  >(request, "/forum/question/create-question", {
    method: "POST",
    body: payload,
  });
  return result;
}
