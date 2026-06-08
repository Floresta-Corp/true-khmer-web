import { requireUser } from "~/lib/server/route-guards.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  parseVoteAction,
  submitVoteAction,
  parseAnswerVoteAction,
  submitAnswerVoteAction,
} from "~/services/forum/action";
import {
  updateAnswerById,
  deleteAnswerById,
  createAnswerByQuestionId,
  SubmitReport,
  addSaveQuestion,
  deleteSaveQuestion,
  markAsBestAnswer,
} from "~/services/forum/server";
import type { Route as ForumDetailRoute } from "project-types/forum/routes/+types/forum.$id";
import type { SubmitReportInput } from "~/services/forum/forum-types";
import { transformActionResponse } from "~/lib/server/action-response.server";

export async function forumDetailAction({
  request,
  params,
}: ForumDetailRoute.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);

  const formData = await request.formData();
  const method = request.method.toUpperCase();
  const questionId = params.questionId;
  const answerId = String(formData.get("answerId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const _replyToAnswer = String(formData.get("replyToAnswer") ?? "").trim();
  const replyToAnswer = _replyToAnswer === "" ? null : _replyToAnswer;
  const actionType = String(formData.get("actionType") ?? "").trim();

  const allowedActionTypes = new Set([
    "vote-question",
    "vote-answer",
    "delete-answer",
    "update-answer",
    "create-answer",
    "report-answer",
    "report-question",
    "save-question",
    "unsave-question",
    "mark-as-best-answer",
  ]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return respond({
      ok: false,
      message: "Unsupported action.",
    });
  }

  if (actionType === "mark-as-best-answer") {
    const answerId = String(formData.get("answerId") ?? "").trim();
    if (!answerId) {
      return respond({
        ok: false,
        message: "Answer ID is required for marking as best answer.",
      });
    }
    try {
      return respond(await markAsBestAnswer(request, answerId));
    } catch (error) {
      return respond(transformActionResponse(error));
    }
  }

  if (actionType === "report-question") {
    const reportQuestionId = String(formData.get("questionId") ?? "").trim();
    const reportTypeId = String(formData.get("typeId") ?? "").trim();
    const reportDescription = String(formData.get("description") ?? "").trim();

    if (!reportQuestionId) {
      return respond({
        ok: false,
        message: "Question ID is required for reporting.",
      });
    }

    if (!reportTypeId) {
      return respond({
        ok: false,
        message: "Report type ID is required.",
      });
    }

    const body: SubmitReportInput = {
      description: reportDescription,
      typeId: reportTypeId,
      questionId: reportQuestionId,
    };
    return respond(await SubmitReport(request, body));
  }

  if (actionType === "report-answer") {
    const reportAnswerId = String(formData.get("answerId") ?? "").trim();
    const reportTypeId = String(formData.get("typeId") ?? "").trim();
    const reportDescription = String(formData.get("description") ?? "").trim();

    if (!reportAnswerId) {
      return respond({
        ok: false,
        message: "Answer ID is required for reporting.",
      });
    }

    if (!reportTypeId) {
      return respond({
        ok: false,
        message: "Report type ID is required.",
      });
    }

    const body: SubmitReportInput = {
      description: reportDescription,
      typeId: reportTypeId,
      answerId: reportAnswerId,
    };

    return respond(await SubmitReport(request, body));
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

  if (actionType === "save-question") {
    const saveQuestionId = String(formData.get("questionId") ?? "").trim();
    if (!saveQuestionId) {
      return respond({
        ok: false,
        message: "Question ID is required for saving.",
      });
    }
    try {
      return respond(await addSaveQuestion(request, saveQuestionId));
    } catch (error) {
      if (error instanceof ProtectedApiError) {
        return respond({
          ok: false,
          message: error.message || "Failed to save question.",
        });
      }
      return respond({
        ok: false,
        message: "Failed to save question.",
      });
    }
  }

  if (actionType === "unsave-question") {
    const saveQuestionId = String(formData.get("questionId") ?? "").trim();
    if (!saveQuestionId) {
      return respond({
        ok: false,
        message: "Question ID is required for unsaving.",
      });
    }
    try {
      return respond(await deleteSaveQuestion(request, saveQuestionId));
    } catch (error) {
      if (error instanceof ProtectedApiError) {
        return respond({
          ok: false,
          message: error.message || "Failed to unsave question.",
        });
      }
      return respond({
        ok: false,
        message: "Failed to unsave question.",
      });
    }
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

  if (actionType === "vote-answer") {
    const parsedAnswerVoteAction = parseAnswerVoteAction(formData);
    if (!parsedAnswerVoteAction.ok) {
      return respond({
        ok: false,
        message: parsedAnswerVoteAction.message,
      });
    }

    return respond(await submitAnswerVoteAction(request, parsedAnswerVoteAction));
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

  if (!questionId) {
    return respond({
      ok: false,
      message: "Question ID is required.",
    });
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

  if (actionType === "create-answer" || !actionType) {
    if (!body) {
      return respond({
        ok: false,
        message: "Answer body is required.",
      });
    }

    const input = {
      questionId,
      body,
      replyToAnswer: replyToAnswer ?? undefined,
    };

    return respond(await createAnswerByQuestionId(request, input));
  }

  return respond({
    ok: false,
    message: "Unsupported action.",
  });
}
