import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
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
} from "~/services/forum/server";
import type { Route as ForumDetailRoute } from "project-types/forum/routes/+types/forum.$id";
import type { SubmitReportInput } from "~/services/forum/forum-types";

export async function forumDetailAction({
  request,
  params,
}: ForumDetailRoute.ActionArgs) {
  await requireAuthenticatedUser(request);

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

  if (actionType === "report-answer") {
    const reportAnswerId = String(formData.get("answerId") ?? "").trim();
    const reportTypeId = String(formData.get("typeId") ?? "").trim();
    const reportDescription = String(formData.get("description") ?? "").trim();

    if (!reportAnswerId) {
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
      answerId: reportAnswerId,
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

    const input = {
      questionId,
      body,
      replyToAnswer: replyToAnswer ?? undefined,
    };

    return createAnswerByQuestionId(request, input);
  }

  return {
    ok: false,
    message: "Unsupported action.",
  };
}
