import type {
  AnswerSortBy,
  QuestionStatusFilter,
} from "~/features/admin/manage-content/types";
import type { QuestionSortBy } from "~/features/forum/types";
import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminDeletePostResponse,
  AdminSuspendPostBody,
  AdminSuspendPostResponse,
  GetAnswersResponse,
  GetQuestionResponse,
  GetQuestionsResponse,
} from "~/types/api-client";

export interface QuestionPaginationParams {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  tagId?: string;
  sortBy?: QuestionSortBy;
  search?: string;
  status?: QuestionStatusFilter;
}

export async function getAdminForumQuestion(
  request: Request,
  accessToken: string,
  params: QuestionPaginationParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params.tagId) queryParams.set("tagId", params.tagId);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.search) queryParams.set("search", params.search);
  if (params.status) queryParams.set("status", params.status);
  const result = await apiRequestWithAccessToken<GetQuestionsResponse>(
    request,
    accessToken,
    `/admin/posts/forum/questions?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return result;
}

export async function getAdminForumQuestionById(
  request: Request,
  accessToken: string,
  questionId: string,
) {
  return apiRequestWithAccessToken<GetQuestionResponse>(
    request,
    accessToken,
    `/admin/posts/forum/questions/${encodeURIComponent(questionId)}`,
    { method: "GET" },
  );
}

export async function getAdminForumQuestionAnswers(
  request: Request,
  accessToken: string,
  questionId: string,
  sortBy?: AnswerSortBy,
) {
  const queryParams = new URLSearchParams();
  if (sortBy) queryParams.set("sortBy", sortBy);
  const query = queryParams.toString();

  return apiRequestWithAccessToken<GetAnswersResponse>(
    request,
    accessToken,
    `/admin/posts/forum/questions/${encodeURIComponent(questionId)}/answers${
      query ? `?${query}` : ""
    }`,
    { method: "GET" },
  );
}

export async function deleteForumQuestion(
  request: Request,
  accessToken: string,
  questionId: string,
) {
  return apiRequestWithAccessToken<AdminDeletePostResponse>(
    request,
    accessToken,
    `/admin/posts/forum/questions/${encodeURIComponent(questionId)}`,
    { method: "DELETE" },
  );
}

export async function suspendForumQuestion(
  request: Request,
  accessToken: string,
  questionId: string,
  body: AdminSuspendPostBody = {},
) {
  return apiRequestWithAccessToken<
    AdminSuspendPostResponse,
    AdminSuspendPostBody
  >(
    request,
    accessToken,
    `/admin/posts/forum/questions/${encodeURIComponent(questionId)}/suspend`,
    { method: "POST", body },
  );
}

export async function unsuspendForumQuestion(
  request: Request,
  accessToken: string,
  questionId: string,
) {
  return apiRequestWithAccessToken<AdminSuspendPostResponse>(
    request,
    accessToken,
    `/admin/posts/forum/questions/${encodeURIComponent(questionId)}/unsuspend`,
    { method: "POST" },
  );
}

export async function deleteForumAnswer(
  request: Request,
  accessToken: string,
  answerId: string,
) {
  return apiRequestWithAccessToken<AdminDeletePostResponse>(
    request,
    accessToken,
    `/admin/posts/forum/answers/${encodeURIComponent(answerId)}`,
    { method: "DELETE" },
  );
}

export async function suspendForumAnswer(
  request: Request,
  accessToken: string,
  answerId: string,
  body: AdminSuspendPostBody = {},
) {
  return apiRequestWithAccessToken<
    AdminSuspendPostResponse,
    AdminSuspendPostBody
  >(
    request,
    accessToken,
    `/admin/posts/forum/answers/${encodeURIComponent(answerId)}/suspend`,
    { method: "POST", body },
  );
}

export async function unsuspendForumAnswer(
  request: Request,
  accessToken: string,
  answerId: string,
) {
  return apiRequestWithAccessToken<AdminSuspendPostResponse>(
    request,
    accessToken,
    `/admin/posts/forum/answers/${encodeURIComponent(answerId)}/unsuspend`,
    { method: "POST" },
  );
}
