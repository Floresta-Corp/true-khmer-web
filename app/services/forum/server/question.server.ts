import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
    CreateForumQuestionInput,
    GetQuestionPaginationResponse,
    GetQuestionResponse,
    VoteIntent,
} from "../types";

export interface QuestionPaginationParams {
    cursor?: string;
    limit?: number;
    categoryId?: string;
    tagId?: string;
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

export async function getQuestionPagination(
    request: Request,
    params: QuestionPaginationParams,
) {
    const queryParams = new URLSearchParams();
    if (params.cursor) queryParams.set("cursor", params.cursor);
    if (params.limit) queryParams.set("limit", params.limit.toString());
    if (params.categoryId) queryParams.set("categoryId", params.categoryId);
    if (params.tagId) queryParams.set("tagId", params.tagId);

    const result = await apiRequestWithSession<GetQuestionPaginationResponse>(
        request,
        `/forum/questions?${queryParams.toString()}`,
        {
            method: "GET",
        },
    );

    return result;
}
