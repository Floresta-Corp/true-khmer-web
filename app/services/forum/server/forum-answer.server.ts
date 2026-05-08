import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import type {
  CreateAnswerInput,
  DeleteAnswerResponse,
  GetAnswersResponse,
  MyAnswerItem,
  MyAnswersResponse,
  UpdateAnswerInput,
  UpsertAnswerResponse,
  VoteAnswerResponse,
} from "../forum-types";
import {
  CreateAnswerInputSchema,
  MyAnswersResponseSchema,
  UpdateAnswerInputSchema,
} from "../forum-types";
import type { VoteIntent } from "~/services/types";

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

export async function myPublishForumAnswer(request: Request) {
  const result = await apiRequestWithSession<MyAnswerItem>(
    request,
    `/forum/answer/my-answers`,
    {
      method: "GET",
    },
  );

  return result;
}

export async function getAnswersByQuestionId(
  request: Request,
  questionId: string,
) {
  try {
    const result = await apiRequestWithSession<GetAnswersResponse>(
      request,
      `/forum/answer/get-answers/${questionId}`,
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
export async function getPublicAnswersByQuestionId(
  request: Request,
  questionId: string,
) {
  try {
    const result = await apiRequestWithOptionalSession<GetAnswersResponse>(
      request,
      `/forum/public/answer/get-answers/${questionId}`,
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
