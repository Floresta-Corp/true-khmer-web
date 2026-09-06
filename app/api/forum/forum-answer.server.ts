import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import {
  isResourceUnavailable,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  DeleteAnswerResponse,
  GetAnswersResponse,
  VoteAnswerResponse,
  CreateAnswerResponse,
  EditAnswerResponse,
} from "~/types/api-client";
import type {
  CreateAnswerInput,
  UpdateAnswerInput,
} from "~/features/forum/types";
import {
  CreateAnswerInputSchema,
  UpdateAnswerInputSchema,
} from "~/features/forum/types";
import type { VoteIntent } from "~/services/types";
import type { GetMyAnswersResponse } from "~/types/api-client";

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

export interface MyAnswerParams {
  search?: string;
  sortBy?: "lastActivity" | "mostReplies";
  category?: string;
  cursor?: string;
  limit?: number;
}

export async function myForumAnswer(request: Request, params?: MyAnswerParams) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.category) query.set("category", params.category);
  if (params?.cursor) query.set("cursor", params.cursor);
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  const path = `/forum/answer/my-answers${qs ? `?${qs}` : ""}`;

  const result = await apiRequestWithSession<GetMyAnswersResponse>(
    request,
    path,
    {
      method: "GET",
    },
  );

  return result;
}
export async function getAnswersByQuestionId(
  request: Request,
  questionId: string,
  sortBy?: string | null,
) {
  try {
    const path =
      `/forum/answer/get-answers/${questionId}` +
      (sortBy ? `?sortBy=${encodeURIComponent(sortBy)}` : "");
    const result = await apiRequestWithSession<GetAnswersResponse>(
      request,
      path,
      {
        method: "GET",
      },
    );

    return result;
  } catch (error) {
    if (isResourceUnavailable(error, "forum answers")) {
      return null;
    }

    throw error;
  }
}
export async function getPublicAnswersByQuestionId(
  request: Request,
  questionId: string,
  sortBy?: string | null,
) {
  try {
    const path =
      `/forum/public/answer/get-answers/${questionId}` +
      (sortBy ? `?sortBy=${encodeURIComponent(sortBy)}` : "");
    const result = await apiRequestWithOptionalSession<GetAnswersResponse>(
      request,
      path,
      {
        method: "GET",
      },
    );
    return result;
  } catch (error) {
    if (isResourceUnavailable(error, "public forum answers")) {
      return null;
    }
    throw error;
  }
}

export async function createAnswerByQuestionId(
  request: Request,
  body: CreateAnswerInput,
) {
  const parsedBody = CreateAnswerInputSchema.safeParse(body);
  if (!parsedBody.success) {
    throw new Error("Invalid create answer payload");
  }
  const result = await apiRequestWithSession<CreateAnswerResponse>(
    request,
    "/forum/answer/create-answer",
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

  const result = await apiRequestWithSession<EditAnswerResponse>(
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

export async function getMyAnswers(request: Request) {
  const result = await apiRequestWithSession<GetAnswersResponse>(
    request,
    `/forum/answer/my-answers`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function markAsBestAnswer(request: Request, answerId: string) {
  return await apiRequestWithSession(
    request,
    `/forum/answer/mark-best-answer/${answerId}`,
    {
      method: "POST",
    },
  );
}
