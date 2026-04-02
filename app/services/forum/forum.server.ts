import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  CreateAnswerInput,
  CreateForumQuestionInput,
  DeleteAnswerResponse,
  GetAnswersResponse,
  GetCategoriesListResponse,
  GetQuestionpaginationResponse,
  GetQuestionResponse,
  UpdateAnswerInput,
  UpsertAnswerResponse,
  VoteAnswerResponse,
  VoteIntent,

} from "./types";
import { CreateAnswerInputSchema, UpdateAnswerInputSchema } from "./types";

export async function createForumQuestion(
  request: Request,
  payload: CreateForumQuestionInput,
) {
  const result = await apiRequestWithSession<
    GetQuestionResponse,
    CreateForumQuestionInput
  >(request, "/forum/questions", {
    method: "POST",
    body: payload,
  });
  return result;
}

export async function updateForumQuestion(
  request: Request,
  questionId: string,
  payload: CreateForumQuestionInput,
) {
  const result = await apiRequestWithSession<
    GetQuestionResponse,
    CreateForumQuestionInput
  >(request, `/forum/questions/edit-question/${questionId}`, {
    method: "PATCH",
    body: payload,
  });
  return result;
}

export async function getQuestionById(request: Request, questionId: string) {
  const result = await apiRequestWithSession<GetQuestionResponse>(
    request,
    `/forum/questions/${questionId}`,
    {
      method: "GET",
    },
  );
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

export async function voteForumAnswer(
  request: Request,
  answerId: string,
  voteType: VoteIntent,
) {
  const result = await apiRequestWithSession<
    VoteAnswerResponse,
    { voteType: VoteIntent }
  >(request, `/forum/answer/vote-answer/${answerId}`, {
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

export async function getAnswersByQuestionId(request: Request, questionId: string) {
  const result = await apiRequestWithSession<GetAnswersResponse>(
    request,
    `/forum/answer/get-answers/${questionId}`,
    {
      method: "GET",
    },
  );
  return result;
}


export async function createAnswerByQuestionId(
  request: Request,
  body: CreateAnswerInput,
) {
  const parsedBody = CreateAnswerInputSchema.safeParse(body);
  if (!parsedBody.success) {
    throw new Error("Invalid create answer payload");
  }

  const result = await apiRequestWithSession<UpsertAnswerResponse>(
    request,
    `/forum/answer/create-answer`,
    {
      method: "POST",
      body: parsedBody.data,
    },
  );
  return result;
}

export async function updateAnswerById(
  request: Request,
  answerId: string,
  body: UpdateAnswerInput,
) {
  const parsedBody = UpdateAnswerInputSchema.safeParse(body);
  if (!parsedBody.success) {
    throw new Error("Invalid update answer payload");
  }

  const result = await apiRequestWithSession<UpsertAnswerResponse>(
    request,
    `/forum/answer/edit-answer/${answerId}`,
    {
      method: "PATCH",
      body: parsedBody.data,
    },
  );

  return result;
}

export async function deleteAnswerById(request: Request, answerId: string) {
  const result = await apiRequestWithSession<DeleteAnswerResponse>(
    request,
    `/forum/answer/delete-answer/${answerId}`,
    {
      method: "DELETE",
    },
  );

  return result;
}