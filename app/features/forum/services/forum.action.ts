import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  parseVoteAction,
  submitVoteAction,
  deleteQuestionAction,
  parseAnswerVoteAction,
  submitAnswerVoteAction,
  reportQuestionAction,
} from "./forum.vote-helpers";
import {
  updateForumQuestion,
  createForumQuestion,
  createAnswerByQuestionId,
  deleteAnswerById,
  updateAnswerById,
  presignForumQuestionImage,
} from "~/api/forum/forum.server";
import { validateCreateForumPostForm } from "./forum.validation";
import type { Route as ForumRoute } from "project-types/forum/route/+types/forum.new";

export async function forumListAction({ request }: ForumRoute.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();
  const questionId = String(formData.get("questionId") ?? "").trim();
  const answerId = String(formData.get("answerId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  const allowedActionTypes = new Set([
    "vote-question",
    "vote-answer",
    "delete-answer",
    "update-answer",
    "create-answer",
    "report-question",
  ]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return respond({
      ok: false,
      message: "Unsupported action.",
    });
  }

  if (actionType === "report-question") {
    return respond(await reportQuestionAction(request, formData));
  }

  if (actionType === "vote-question") {
    const parsedVoteAction = parseVoteAction(formData);
    if (!parsedVoteAction.ok) {
      return respond({
        ok: false,
        message: parsedVoteAction.message,
      });
    }
    return respond(await submitVoteAction(request, parsedVoteAction));
  }

  if (actionType === "vote-answer") {
    const parsedAnswerVoteAction = parseAnswerVoteAction(formData);
    if (!parsedAnswerVoteAction.ok) {
      return respond({
        ok: false,
        message: parsedAnswerVoteAction.message,
      });
    }

    return respond(
      await submitAnswerVoteAction(request, parsedAnswerVoteAction),
    );
  }

  if (actionType === "update-answer") {
    if (method !== "PATCH") {
      return respond({
        ok: false,
        message: "Invalid method for updating an answer.",
      });
    }

    if (!answerId) {
      return respond({
        ok: false,
        message: "Answer ID is required.",
      });
    }

    if (!body) {
      return respond({
        ok: false,
        message: "Answer body is required.",
      });
    }

    return respond(await updateAnswerById(request, answerId, { body }));
  }

  if (actionType === "delete-answer") {
    if (!answerId) {
      return respond({
        ok: false,
        message: "Answer ID is required.",
      });
    }

    return respond(await deleteAnswerById(request, answerId));
  }

  if (actionType === "create-answer") {
    if (!questionId) {
      return respond({
        ok: false,
        message: "Question ID is required.",
      });
    }

    if (!body) {
      return respond({
        ok: false,
        message: "Answer body is required.",
      });
    }

    return respond(
      await createAnswerByQuestionId(request, { questionId, body }),
    );
  }

  if (method === "DELETE") {
    return respond(await deleteQuestionAction(request, formData));
  }

  const file = formData.get("image") as File | null;
  const removeImage =
    String(formData.get("removeImage") ?? "").trim() === "true";

  // handle image removal
  if (removeImage && method === "PATCH") {
    formData.set("imageKey", "");
  }

  if (file) {
    try {
      const presignResult = await presignForumQuestionImage(request, {
        contentType: file.type,
        fileSize: file.size,
      });

      if (!presignResult?.data?.ok) {
        return respond({
          ok: false,
          message: "Failed to presign image upload.",
        });
      }

      const upload = presignResult.data.upload;
      const uploadResult = await fetch(upload.uploadUrl, {
        method: upload.method,
        headers: upload.requiredHeaders,
        body: file,
        signal: AbortSignal.timeout(30_000),
      });

      if (!uploadResult.ok) {
        return respond({
          ok: false,
          message: "Failed to upload image to storage provider.",
        });
      }

      // only set imageKey once when upload succeeds
      formData.set("imageKey", upload.imageKey);
    } catch (err) {
      // handle unexpected errors during presign/upload
      return respond({
        ok: false,
        message: "An error occurred while uploading the image.",
      });
    }
  }

  const validation = validateCreateForumPostForm(formData);
  if (!validation.success) {
    return respond({
      ok: false,
      message: validation.message,
      fieldErrors: validation.fieldErrors,
    });
  }

  if (method === "PATCH") {
    const questionId = String(formData.get("questionId") ?? "").trim();
    if (!questionId) {
      return respond({
        ok: false,
        message: "Question ID is required for updating.",
      });
    }

    return respond(
      await updateForumQuestion(request, questionId, validation.data),
    );
  }

  return respond(await createForumQuestion(request, validation.data));
}
