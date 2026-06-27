import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
    deleteForumQuestion,
    voteForumAnswer,
    voteForumQuestion,
} from "~/api/forum/forum.server";
import type { VoteIntent } from "../types";

const VALID_VOTE_TYPES: readonly VoteIntent[] = ["UPVOTE", "DOWNVOTE", "NONE"];

type VoteActionParseResult =
    | { ok: true; questionId: string; voteType: VoteIntent }
    | { ok: false; message: string };

type AnswerVoteActionParseResult =
    | { ok: true; answerId: string; voteType: VoteIntent }
    | { ok: false; message: string };

export function parseVoteAction(formData: FormData): VoteActionParseResult {
    const questionId = String(formData.get("questionId") ?? "").trim();
    const voteType = String(formData.get("voteType") ?? "")
        .trim()
        .toUpperCase();

    if (!questionId) {
        return {
            ok: false,
            message: "Question ID is required for voting.",
        };
    }

    if (!VALID_VOTE_TYPES.includes(voteType as VoteIntent)) {
        return {
            ok: false,
            message: "Invalid vote type.",
        };
    }

    return {
        ok: true,
        questionId,
        voteType: voteType as VoteIntent,
    };
}

export async function submitVoteAction(
    request: Request,
    payload: { questionId: string; voteType: VoteIntent },
) {
    try {
        return await voteForumQuestion(
            request,
            payload.questionId,
            payload.voteType,
        );
    } catch (error) {
        if (error instanceof ProtectedApiError) {
            return {
                ok: false,
                message: error.message || "Failed to submit vote. Please try again.",
            };
        }

        return {
            ok: false,
            message: "Failed to submit vote. Please try again.",
        };
    }
}

export function parseAnswerVoteAction(
    formData: FormData,
): AnswerVoteActionParseResult {
    const answerId = String(formData.get("answerId") ?? "").trim();
    const voteType = String(formData.get("voteType") ?? "")
        .trim()
        .toUpperCase();

    if (!answerId) {
        return {
            ok: false,
            message: "Answer ID is required for voting.",
        };
    }

    if (!VALID_VOTE_TYPES.includes(voteType as VoteIntent)) {
        return {
            ok: false,
            message: "Invalid vote type.",
        };
    }

    return {
        ok: true,
        answerId,
        voteType: voteType as VoteIntent,
    };
}

export async function submitAnswerVoteAction(
    request: Request,
    payload: { answerId: string; voteType: VoteIntent },
) {
    try {
        return await voteForumAnswer(request, payload.answerId, payload.voteType);
    } catch (error) {
        if (error instanceof ProtectedApiError) {
            return {
                ok: false,
                message: error.message || "Failed to submit vote. Please try again.",
            };
        }

        return {
            ok: false,
            message: "Failed to submit vote. Please try again.",
        };
    }
}

export async function deleteQuestionAction(request: Request, formData: FormData) {
    const questionId = String(formData.get("questionId") ?? "").trim();
    if (!questionId) {
        return {
            ok: false,
            message: "Question ID is required for deleting.",
        }
    };

    return deleteForumQuestion(request, questionId);
}