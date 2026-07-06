import type { Route as ForumRoute } from "project-types/forum/route/+types/forum.search";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  deleteQuestionAction,
  parseVoteAction,
  submitVoteAction,
  reportQuestionAction,
} from "./forum.vote-helpers";
import { updateForumQuestion } from "~/api/forum/forum.server";
import { validateCreateForumPostForm } from "./forum.validation";

export async function forumSearchAction({
  request,
}: ForumRoute.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);
  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const method = request.method.toUpperCase();

  const allowedActionTypes = new Set(["vote-question", "report-question"]);

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
  if (method === "DELETE") {
    return respond(await deleteQuestionAction(request, formData));
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

    return respond(await updateForumQuestion(request, questionId, validation.data));
  }

  return respond({
    ok: false,
    message: `Unsupported method: ${method}`,
  });
}
