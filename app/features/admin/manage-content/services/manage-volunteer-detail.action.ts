import { data } from "react-router";
import type { Route } from "project-types/admin/manage-content/route/+types/manage-volunteer.$opportunityId";

import { deleteVolunteer } from "~/api/admin/manage-volunteer/manage-volunteer.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import {
  handleVolunteerSuspendIntent,
  isVolunteerSuspendIntent,
} from "./manage-volunteer-suspend.action";

export async function manageVolunteerDetailAction({
  request,
}: Route.ActionArgs) {
  const { accessToken, setCookie } = await requireAdmin(request);

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  try {
    if (intent === "deleteVolunteer") {
      const opportunityId = String(formData.get("opportunityId") ?? "").trim();

      if (!opportunityId) {
        return data(
          { ok: false, message: "Opportunity ID is required" },
          { status: 400 },
        );
      }

      await deleteVolunteer(request, accessToken, opportunityId);

      return data(
        {
          ok: true,
          intent,
          opportunityId,
          message: "Opportunity deleted successfully.",
        },
        cookieHeader,
      );
    }

    if (isVolunteerSuspendIntent(intent)) {
      return handleVolunteerSuspendIntent(
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
      { ok: false, message: "Failed to complete the moderation action." },
      { status: 500, ...cookieHeader },
    );
  }
}
