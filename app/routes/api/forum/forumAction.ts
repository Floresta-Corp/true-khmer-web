import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { parseVoteAction, submitVoteAction, deleteQuestionAction, parseAnswerVoteAction, submitAnswerVoteAction } from "~/services/forum/action";
import { updateForumQuestion, createForumQuestion, createAnswerByQuestionId, deleteAnswerById, updateAnswerById } from "~/services/forum/server";
import { validateCreateForumPostForm } from "~/services/forum/utils";
import type { Route as ForumRoute } from "../../../features/forum/routes/+types/forum";



export async function forumListAction({ request }: ForumRoute.ActionArgs) {
    await requireAuthenticatedUser(request);

    const formData = await request.formData();
    const actionType = String(formData.get("actionType") ?? "").trim();
    const method = request.method.toUpperCase();
    const questionId = String(formData.get("questionId") ?? "").trim();
    const answerId = String(formData.get("answerId") ?? "").trim();
    const body = String(formData.get("body") ?? "").trim();

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

    if (actionType === "delete-answer") {
        if (!answerId) {
            return {
                ok: false,
                message: "Answer ID is required.",
            };
        }

        return deleteAnswerById(request, answerId);
    }

    if (actionType === "create-answer") {
        if (!questionId) {
            return {
                ok: false,
                message: "Question ID is required.",
            };
        }

        if (!body) {
            return {
                ok: false,
                message: "Answer body is required.",
            };
        }

        return createAnswerByQuestionId(request, { questionId, body });
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