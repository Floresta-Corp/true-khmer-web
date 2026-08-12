import { data } from "react-router";
import type { Route } from "project-types/admin/manage-content/route/+types/manage-forum";

import { deleteForumQuestion } from "~/api/admin/manage-forum/manage-forum.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import {
  handleSuspendIntent,
  isSuspendIntent,
} from "./manage-forum-suspend.action";

export async function manageForumAction({ request }: Route.ActionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  const { accessToken, setCookie } = await getAdminAccessToken(request);
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  if (!accessToken) {
    return data(
      { ok: false, message: "Your session has expired. Please sign in again." },
      { status: 401 },
    );
  }

  try {
    if (intent === "deleteQuestion") {
      const questionId = String(formData.get("questionId") ?? "").trim();

      if (!questionId) {
        return data(
          { ok: false, message: "Question ID is required" },
          { status: 400 },
        );
      }

      await deleteForumQuestion(request, accessToken, questionId);

      return data(
        {
          ok: true,
          intent,
          questionId,
          message: "Question deleted successfully.",
        },
        cookieHeader,
      );
    }

    if (isSuspendIntent(intent)) {
      return handleSuspendIntent(
        request,
        accessToken,
        formData,
        intent,
        cookieHeader,
      );
    }

    return data(
      { ok: false, message: "Unknown action intent" },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return data({ ok: false, message: err.message }, { status: err.status });
    }
    return data(
      { ok: false, message: "Failed to complete the moderation action." },
      { status: 500 },
    );
  }
}
