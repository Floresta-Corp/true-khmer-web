import type { Route } from "project-types/admin/manage-content/route/+types/manage-launchpad.$launchpadId";

import { getAdminLaunchpadById } from "~/api/admin/manage-launchpad/manage-launchpad.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { AdminLaunchpadPostDetailResponse } from "~/types/api-client";

export type ManageLaunchpadDetailLoaderData = {
  project: AdminLaunchpadPostDetailResponse;
};

export async function manageLaunchpadDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const launchpadId = params.launchpadId;
  if (!launchpadId) {
    throw new Response("Project ID is required", { status: 400 });
  }

  try {
    const result = await getAdminLaunchpadById(
      request,
      auth.accessToken,
      launchpadId,
    );

    return withAuthData(auth, {
      project: result.launchpad,
    } satisfies ManageLaunchpadDetailLoaderData);
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Project not found", { status: 404 });
    }
    throw error;
  }
}
