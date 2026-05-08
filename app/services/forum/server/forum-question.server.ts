import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import type {
  CreateForumQuestionInput,
  GetQuestionPaginationResponse,
  GetQuestionResponse,
  Question,
  QuestionSortBy,
} from "../forum-types";
import type { VoteIntent } from "~/services/types";

export interface QuestionPaginationParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  sortBy?: QuestionSortBy;
  isUnanswered?: boolean;
  isTrending?: boolean;
  search?: string;
}

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

export async function myPublishForumQuestion(request: Request) {
  const result = await apiRequestWithSession<GetQuestionResponse>(
    request,
    `/forum/questions/my-questions`,
    {
      method: "GET",
    },
  );
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

export async function deleteForumQuestion(
  request: Request,
  questionId: string,
) {
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

export async function getPublicQuestionPagination(
  request: Request,
  params: QuestionPaginationParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params.tagId) queryParams.set("tagId", params.tagId);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.isTrending) queryParams.set("isTrending", "true");
  if (params.isUnanswered) queryParams.set("isUnanswered", "true");
  if (params.search) queryParams.set("search", params.search);

  const result =
    await apiRequestWithOptionalSession<GetQuestionPaginationResponse>(
      request,
      `/forum/public/questions?${queryParams.toString()}`,
      {
        method: "GET",
      },
    );

  return result;
}

export async function getQuestionPagination(
  request: Request,
  params: QuestionPaginationParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params.tagId) queryParams.set("tagId", params.tagId);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.isTrending) queryParams.set("isTrending", "true");
  if (params.isUnanswered) queryParams.set("isUnanswered", "true");
  if (params.search) queryParams.set("search", params.search);

  const result = await apiRequestWithSession<GetQuestionPaginationResponse>(
    request,
    `/forum/questions?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return result;
}

export async function getPublicQuestionById(
  request: Request,
  questionId: string,
) {
  try {
    const result = await apiRequestWithOptionalSession<GetQuestionResponse>(
      request,
      `/forum/public/questions/${questionId}`,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getQuestionById(request: Request, questionId: string) {
  try {
    const result = await apiRequestWithSession<GetQuestionResponse>(
      request,
      `/forum/questions/${questionId}`,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function deleteSaveQuestion(request: Request, questionId: string) {
  const result = await apiRequestWithSession<GetQuestionResponse>(
    request,
    `/forum/questions/save-question/${questionId}`,
    {
      method: "DELETE",
    },
  );

  return result;
}

export async function addSaveQuestion(request: Request, questionId: string) {
  const result = await apiRequestWithSession<GetQuestionResponse>(
    request,
    `/forum/questions/save-question/${questionId}`,
    {
      method: "POST",
    },
  );

  return result;
}
