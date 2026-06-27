import { data } from "react-router";
import type { Route } from "project-types/admin/usermanagement/route/+types/user-management.$userId";

import { ProtectedApiError } from "~/lib/server/api-client.server";
import { updateAdminUserSuspension } from "~/api/admin/user-management/user-management.server";

export async function userManagementDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  if (!params.userId) {
    return data({ ok: false, error: "User ID is required." }, { status: 400 });
  }

  const formData = await request.formData();
  const action = formData.get("action");

  if (action !== "suspend" && action !== "unsuspend") {
    return data(
      { ok: false, error: "Unsupported user management action." },
      { status: 400 },
    );
  }

  try {
    const result = await updateAdminUserSuspension(
      request,
      params.userId,
      action,
    );

    return data(
      { ok: true, user: result.data.user },
      result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : undefined,
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return data(
        { ok: false, error: error.message },
        { status: error.status },
      );
    }

    throw error;
  }
}
