import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { Route } from "project-types/workspace/routes/+types/workspace";
import {
  deleteAnswerById,
  deleteForumQuestion,
  updateAnswerById,
  updateForumQuestion,
} from "~/services/forum/server";
import { validateCreateForumPostForm } from "~/services/forum/validation";
import {
  actionError,
  runServiceAction,
  type WorkSpaceActionResult,
} from "./work-space-result";

/** Merge the auth cookie with any refreshed-session cookie from the service call. */
function mergeSetCookie(authSetCookie?: string | string[], serviceSetCookie?: string) {
  const cookies = [
    ...(Array.isArray(authSetCookie) ? authSetCookie : authSetCookie ? [authSetCookie] : []),
    ...(serviceSetCookie ? [serviceSetCookie] : []),
  ];
  return cookies.length ? cookies : undefined;
}

export async function workSpaceAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();
  const answerId = String(formData.get("answerId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const respond = (result: WorkSpaceActionResult, serviceSetCookie?: string) =>
    withAuthData(
      { setCookie: mergeSetCookie(auth.setCookie, serviceSetCookie) },
      result,
    );

  const allowedActionTypes = new Set(["delete-answer", "update-answer"]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return respond(actionError("Unsupported action."));
  }

  if (actionType === "update-answer") {
    if (method !== "PATCH") {
      return respond(actionError("Invalid method for updating an answer."));
    }
    if (!answerId) {
      return respond(actionError("Answer ID is required."));
    }
    if (!body) {
      return respond(actionError("Answer body is required."));
    }

    const { result, setCookie } = await runServiceAction(
      () => updateAnswerById(request, answerId, { body }),
      {
        success: "Answer updated successfully.",
        error: "Failed to update answer.",
      },
    );
    return respond(result, setCookie);
  }

  if (actionType === "delete-answer") {
    if (!answerId) {
      return respond(actionError("Answer ID is required."));
    }

    const { result, setCookie } = await runServiceAction(
      () => deleteAnswerById(request, answerId),
      {
        success: "Answer deleted successfully.",
        error: "Failed to delete answer.",
      },
    );
    return respond(result, setCookie);
  }

  if (method === "DELETE") {
    const questionId = String(formData.get("questionId") ?? "").trim();
    if (!questionId) {
      return respond(actionError("Question ID is required for deleting."));
    }

    const { result, setCookie } = await runServiceAction(
      () => deleteForumQuestion(request, questionId),
      {
        success: "Question deleted successfully.",
        error: "Failed to delete question.",
      },
    );
    return respond(result, setCookie);
  }

  const validation = validateCreateForumPostForm(formData);
  if (!validation.success) {
    return respond(actionError(validation.message, validation.fieldErrors));
  }

  if (method === "PATCH") {
    const questionId = String(formData.get("questionId") ?? "").trim();
    if (!questionId) {
      return respond(actionError("Question ID is required for updating."));
    }

    const { result, setCookie } = await runServiceAction(
      () => updateForumQuestion(request, questionId, validation.data),
      {
        success: "Question updated successfully.",
        error: "Failed to update question.",
      },
    );
    return respond(result, setCookie);
  }

  return respond(actionError("Unsupported action."));
}
