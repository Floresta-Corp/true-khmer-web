import { data } from "react-router";
import type { Route } from "project-types/admin/manage-content/route/+types/manage-launchpad";

import { deleteLaunchpad } from "~/api/admin/manage-launchpad/manage-launchpad.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import {
  handleLaunchpadSuspendIntent,
  isLaunchpadSuspendIntent,
} from "./manage-launchpad-suspend.action";

export async function manageLaunchpadAction({ request }: Route.ActionArgs) {
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
    if (intent === "deleteLaunchpad") {
      const launchpadId = String(formData.get("launchpadId") ?? "").trim();

      if (!launchpadId) {
        return data(
          { ok: false, message: "Project ID is required" },
          { status: 400 },
        );
      }

      await deleteLaunchpad(request, accessToken, launchpadId);

      return data(
        {
          ok: true,
          intent,
          launchpadId,
          message: "Project deleted successfully.",
        },
        cookieHeader,
      );
    }

    if (isLaunchpadSuspendIntent(intent)) {
      return handleLaunchpadSuspendIntent(
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
