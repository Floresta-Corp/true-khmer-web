import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import type { Route } from "project-types/workspace/routes/+types/workspace";
import {
  deleteAnswerById,
  updateAnswerById,
  updateForumQuestion,
} from "~/services/forum/server";
import { deleteQuestionAction } from "~/services/forum/action";
import { validateCreateForumPostForm } from "~/services/forum/validation";

export async function workSpaceAction({ request }: Route.ActionArgs) {
  await requireAuthenticatedUser(request);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();
  const answerId = String(formData.get("answerId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const allowedActionTypes = new Set(["delete-answer", "update-answer"]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return {
      ok: false,
      message: "Unsupported action.",
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

  if (actionType === "delete-answer") {
    if (!answerId) {
      return {
        ok: false,
        message: "Answer ID is required.",
      };
    }

    return deleteAnswerById(request, answerId);
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
}
