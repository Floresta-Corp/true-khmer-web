import { data } from "react-router";
import type { Route } from "project-types/admin/manage-education/route/+types/manage-education.$courseId";

import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import {
  handleCourseReviewIntent,
  isCourseReviewIntent,
} from "./manage-education-review.action";

export async function manageEducationDetailAction({
  request,
}: Route.ActionArgs) {
  const { accessToken, setCookie } = await requireAdmin(request);

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  try {
    if (isCourseReviewIntent(intent)) {
      return await handleCourseReviewIntent(
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
      return data(
        { ok: false, message: err.message },
        { status: err.status, ...cookieHeader },
      );
    }
    return data(
      { ok: false, message: "Failed to complete the review action." },
      { status: 500, ...cookieHeader },
    );
  }
}
