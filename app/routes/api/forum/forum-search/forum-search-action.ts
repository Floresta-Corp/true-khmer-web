import type { Route as ForumRoute } from "project-types/forum/routes/+types/forum.search";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  deleteQuestionAction,
  parseVoteAction,
  submitVoteAction,
} from "~/services/forum/action";
import type { SubmitReportInput } from "~/services/forum/forum-types";
import { SubmitReport, updateForumQuestion } from "~/services/forum/server";
import { validateCreateForumPostForm } from "~/services/forum/validation";

export default async function ForumSearchAction({
  request,
}: ForumRoute.ActionArgs) {
  await requireAuthenticatedUser(request);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();

  const allowedActionTypes = new Set(["vote-question", "report-question"]);

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
