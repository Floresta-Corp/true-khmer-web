import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { parseVoteAction, submitVoteAction, deleteQuestionAction, parseAnswerVoteAction, submitAnswerVoteAction } from "~/services/forum/action";
import { updateForumQuestion, createForumQuestion, createAnswerByQuestionId, deleteAnswerById, updateAnswerById } from "~/services/forum/server";
import { validateCreateForumPostForm } from "~/services/forum/utils";
import type { Route as ForumRoute } from "../../../features/forum/routes/+types/forum";
import type { Route as ForumDetailRoute } from "../../../features/forum/routes/+types/forum-detail";


export async function forumListAction({ request }: ForumRoute.ActionArgs) {
    await requireAuthenticatedUser(request);

    const formData = await request.formData();
    const actionType = String(formData.get("actionType") ?? "").trim();
    const method = request.method.toUpperCase();

    if (actionType === "vote-question") {
        const parsedVoteAction = parseVoteAction(formData);
        if (!parsedVoteAction.ok) {
            return {
                ok: false,
                message: parsedVoteAction.message,
            };
        }
        return submitVoteAction(request, parsedVoteAction);
    }

    if (method === "DELETE") {
        return deleteQuestionAction(request, formData);
    }

    const validation = validateCreateForumPostForm(formData);
    if (!validation.success) {
        return {
            ok: false,
            message: validation.message,
            fieldErrors: validation.fieldErrors,
        };
    }

    if (method === "PATCH") {
        const questionId = String(formData.get("questionId") ?? "").trim();
        if (!questionId) {
            return {
                ok: false,
                message: "Question ID is required for updating.",
            };
        }

        return updateForumQuestion(request, questionId, validation.data);
    }

    return createForumQuestion(request, validation.data);
}

export async function forumDetailAction({ request, params }: ForumDetailRoute.ActionArgs) {
    await requireAuthenticatedUser(request);

    const formData = await request.formData();
    const method = request.method.toUpperCase();
    const questionId = params.questionId;
    const answerId = String(formData.get("answerId") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();
    const actionType = String(formData.get("actionType") ?? "").trim();

    const allowedActionTypes = new Set([
        "vote-question",
        "vote-answer",
        "delete-answer",
        "update-answer",
        "create-answer",
    ]);

    if (actionType && !allowedActionTypes.has(actionType)) {
        return {
            ok: false,
            message: "Unsupported action.",
        };
    }

    if (actionType === "vote-question") {
        const parsedVoteAction = parseVoteAction(formData);
        if (!parsedVoteAction.ok) {
            return {
                ok: false,
                message: parsedVoteAction.message,
            };
        }

        return submitVoteAction(request, parsedVoteAction);
    }

    if (actionType === "vote-answer") {
        const parsedAnswerVoteAction = parseAnswerVoteAction(formData);
        if (!parsedAnswerVoteAction.ok) {
            return {
                ok: false,
                message: parsedAnswerVoteAction.message,
            };
        }

        return submitAnswerVoteAction(request, parsedAnswerVoteAction);
    }

    if (actionType === "delete-answer") {
        if (!answerId) {
            return {
                ok: false,
                message: "Answer ID is required.",
            };
        }

        return deleteAnswerById(request, answerId);
    }

    if (!questionId) {
        return {
            ok: false,
            message: "Question ID is required.",
        };
    }

    if (actionType === "update-answer") {
        if (method !== "PATCH") {
            return {
                ok: false,
                message: "Invalid method for updating an answer.",
            };
        }

        if (!answerId) {
            return {
                ok: false,
                message: "Answer ID is required.",
            };
        }

        if (!body) {
            return {
                ok: false,
                message: "Answer body is required.",
            };
        }

        return updateAnswerById(request, answerId, { body });
    }

    if (actionType === "create-answer" || !actionType) {
        if (!body) {
            return {
                ok: false,
                message: "Answer body is required.",
            };
        }

        return createAnswerByQuestionId(request, { questionId, body });
    }

    return {
        ok: false,
        message: "Unsupported action.",
    };
}