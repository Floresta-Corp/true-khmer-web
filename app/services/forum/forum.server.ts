import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  CreateForumPostInput,
  GetAnswersResponse,
  GetCategoriesListResponse,
  GetQuestionpaginationResponse,
  GetQuestionResponse,
  VoteIntent,
} from "./types";

export async function createForumQuestion(
  request: Request,
  payload: CreateForumPostInput,
) {
  const result = await apiRequestWithSession<
    GetQuestionResponse,
    CreateForumPostInput
  >(request, "/forum/questions", {
    method: "POST",
    body: payload,
  });
  return result;
}

export async function updateForumQuestion(
  request: Request,
  questionId: string,
  payload: CreateForumPostInput,
) {
  const result = await apiRequestWithSession<
    GetQuestionResponse,
    CreateForumPostInput
  >(request, `/forum/questions/edit-question/${questionId}`, {
    method: "PATCH",
    body: payload,
  });
  return result;
}

export async function deleteForumQuestion(request: Request, questionId: string) {
  const result = await apiRequestWithSession<GetQuestionResponse>(
    request,
    `/forum/questions/delete-question/${questionId}`,
    {
      method: "DELETE",
    },
  );
  return result;
}

export async function voteForumQuestion(
  request: Request,
  questionId: string,
  voteType: VoteIntent,
) {
  const result = await apiRequestWithSession<
    GetQuestionResponse,
    { voteType: VoteIntent }
  >(request, `/forum/questions/vote-question/${questionId}`, {
    method: "POST",
    body: { voteType },
  });

  return result;
}

export async function getCategories(request: Request) {
  const result = await apiRequestWithSession<GetCategoriesListResponse>(
    request,
    "/forum/category",
    {
      method: "GET",
    },
  );
  return result;
}

interface PaginationParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
}

export async function getQuestionPagination(
  request: Request,
  params: PaginationParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  const result = await apiRequestWithSession<GetQuestionpaginationResponse>(
    request,
    `/forum/questions?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function getAnswers(request: Request, questionId: string) {
  const result = await apiRequestWithSession<GetAnswersResponse>(
    request,
    `/forum/answer/get-answers/${questionId}`,
    {
      method: "GET",
    },
  );
  return result;
}
