import { ProtectedApiError } from "~/lib/server/api-client.server";
import {
    deleteForumQuestion,
    voteForumAnswer,
    voteForumQuestion,
    SubmitReport,
} from "~/api/forum/forum.server";
import type { SubmitReportInput, VoteIntent } from "../types";

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

export async function reportQuestionAction(request: Request, formData: FormData) {
    const questionId = String(formData.get("questionId") ?? "").trim();
    const typeId = String(formData.get("typeId") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!questionId) {
        return { ok: false, message: "Question ID is required for reporting." };
    }

    if (!typeId) {
        return { ok: false, message: "Report type ID is required." };
    }

    const body: SubmitReportInput = { description, typeId, questionId };
    return SubmitReport(request, body);
}

export async function reportAnswerAction(request: Request, formData: FormData) {
    const answerId = String(formData.get("answerId") ?? "").trim();
    const typeId = String(formData.get("typeId") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!answerId) {
        return { ok: false, message: "Answer ID is required for reporting." };
    }

    if (!typeId) {
        return { ok: false, message: "Report type ID is required." };
    }

    const body: SubmitReportInput = { description, typeId, answerId };
    return SubmitReport(request, body);
}