import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  parseVoteAction,
  submitVoteAction,
  deleteQuestionAction,
  parseAnswerVoteAction,
  submitAnswerVoteAction,
} from "~/services/forum/action";
import {
  updateForumQuestion,
  createForumQuestion,
  createAnswerByQuestionId,
  deleteAnswerById,
  updateAnswerById,
  SubmitReport,
  presignForumQuestionImage,
} from "~/services/forum/server";
import { validateCreateForumPostForm } from "~/services/forum/validation";
import type { Route as ForumRoute } from "project-types/forum/routes/+types/forum.new";
import type { SubmitReportInput } from "~/services/forum/forum-types";

export async function forumListAction({ request }: ForumRoute.ActionArgs) {
  await requireAuthenticatedUser(request);
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
    return {
      ok: false,
      message: "Unsupported action.",
    };
  }

  if (actionType === "report-question") {
    const reportQuestionId = String(formData.get("questionId") ?? "").trim();
    const reportTypeId = String(formData.get("typeId") ?? "").trim();
    const reportDescription = String(formData.get("description") ?? "").trim();

    if (!reportQuestionId) {
      return {
        ok: false,
        message: "Question ID is required for reporting.",
      };
    }

    if (!reportTypeId) {
      return {
        ok: false,
        message: "Report type ID is required.",
      };
    }

    const body: SubmitReportInput = {
      description: reportDescription,
      typeId: reportTypeId,
      questionId: reportQuestionId,
    };
    return SubmitReport(request, body);
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

  const file = formData.get("image") as File | null;
  if (file) {
    try {
      const presignResult = await presignForumQuestionImage(request, {
        contentType: file.type,
        fileSize: file.size,
      });

      if (!presignResult?.data?.ok) {
        return {
          ok: false,
          message: "Failed to presign image upload.",
        };
      }

      const upload = presignResult.data.upload;
      const uploadResult = await fetch(upload.uploadUrl, {
        method: upload.method,
        headers: upload.requiredHeaders,
        body: file,
      });

      if (!uploadResult.ok) {
        return {
          ok: false,
          message: "Failed to upload image to storage provider.",
        };
      }

      // only set imageKey once when upload succeeds
      formData.set("imageKey", upload.imageKey);
    } catch (err) {
      // handle unexpected errors during presign/upload
      console.error("Error uploading image:", err);
      return {
        ok: false,
        message: "An error occurred while uploading the image.",
      };
    }
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
