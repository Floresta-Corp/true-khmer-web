import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { Route } from "project-types/workspace/route/+types/workspace";
import {
  deleteAnswerById,
  deleteForumQuestion,
  updateAnswerById,
  updateForumQuestion,
} from "~/api/forum/forum.server";
import {
  validateCreateForumPostForm,
  validateDeleteAnswerForm,
  validateDeleteQuestionForm,
  validateUpdateAnswerForm,
  validateUpdateQuestionForm,
} from "~/features/forum/services/forum.validation";
import {
  actionError,
  runServiceAction,
  type WorkSpaceActionResult,
} from "./work-space-result";
import { z } from "zod";
import { voteForumQuestion } from "~/api/forum/forum-question.server";
import { voteForumAnswer } from "~/api/forum/forum-answer.server";

const voteTypeEnum = z.enum(["UPVOTE", "DOWNVOTE", "NONE"]);

const voteQuestionSchema = z.object({
  questionId: z.string().trim().min(1, "Question ID is required."),
  voteType: voteTypeEnum,
});

const voteAnswerSchema = z.object({
  answerId: z.string().trim().min(1, "Answer ID is required."),
  voteType: voteTypeEnum,
});

/** Merge the auth cookie with any refreshed-session cookie from the service call. */
function mergeSetCookie(
  authSetCookie?: string | string[],
  serviceSetCookie?: string,
) {
  const cookies = [
    ...(Array.isArray(authSetCookie)
      ? authSetCookie
      : authSetCookie
        ? [authSetCookie]
        : []),
    ...(serviceSetCookie ? [serviceSetCookie] : []),
  ];
  return cookies.length ? cookies : undefined;
}

export async function workSpaceAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();

  const respond = (result: WorkSpaceActionResult, serviceSetCookie?: string) =>
    withAuthData(
      { setCookie: mergeSetCookie(auth.setCookie, serviceSetCookie) },
      result,
    );

  const allowedActionTypes = new Set([
    "delete-answer",
    "update-answer",
    "vote-question",
    "vote-answer",
  ]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return respond(actionError("Unsupported action."));
  }

  if (actionType === "vote-question") {
    const parsed = voteQuestionSchema.safeParse({
      questionId: String(formData.get("questionId") ?? ""),
      voteType: String(formData.get("voteType") ?? "").toUpperCase(),
    });
    if (!parsed.success) return respond(actionError("Invalid vote data."));
    const { result, setCookie } = await runServiceAction(
      () =>
        voteForumQuestion(
          request,
          parsed.data.questionId,
          parsed.data.voteType,
        ),
      { success: "Vote submitted.", error: "Failed to submit vote." },
    );
    return respond(result, setCookie);
  }

  if (actionType === "vote-answer") {
    const parsed = voteAnswerSchema.safeParse({
      answerId: String(formData.get("answerId") ?? ""),
      voteType: String(formData.get("voteType") ?? "").toUpperCase(),
    });
    if (!parsed.success) return respond(actionError("Invalid vote data."));
    const { result, setCookie } = await runServiceAction(
      () =>
        voteForumAnswer(request, parsed.data.answerId, parsed.data.voteType),
      { success: "Vote submitted.", error: "Failed to submit vote." },
    );
    return respond(result, setCookie);
  }

  if (actionType === "update-answer") {
    if (method !== "PATCH") {
      return respond(actionError("Invalid method for updating an answer."));
    }
    const validation = validateUpdateAnswerForm(formData);
    if (!validation.success) {
      return respond(actionError(validation.message, validation.fieldErrors));
    }
    const { answerId, body } = validation.data;

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
    const validation = validateDeleteAnswerForm(formData);
    if (!validation.success) {
      return respond(actionError(validation.message, validation.fieldErrors));
    }
    const { answerId } = validation.data;

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
    const validation = validateDeleteQuestionForm(formData);
    if (!validation.success) {
      return respond(actionError(validation.message, validation.fieldErrors));
    }
    const { questionId } = validation.data;

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
    const idValidation = validateUpdateQuestionForm(formData);
    if (!idValidation.success) {
      return respond(
        actionError(idValidation.message, idValidation.fieldErrors),
      );
    }
    const { questionId } = idValidation.data;

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
