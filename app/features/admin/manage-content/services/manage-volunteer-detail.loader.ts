import type { Route } from "project-types/admin/manage-content/route/+types/manage-volunteer.$opportunityId";

import { getAdminVolunteerById } from "~/api/admin/manage-volunteer/manage-volunteer.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { AdminVolunteerPostResponse } from "~/types/api-client";

export type ManageVolunteerDetailLoaderData = {
  opportunity: AdminVolunteerPostResponse["opportunity"];
};

export async function manageVolunteerDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const opportunityId = params.opportunityId;
  if (!opportunityId) {
    throw new Response("Opportunity ID is required", { status: 400 });
  }

  let opportunity: AdminVolunteerPostResponse["opportunity"] | undefined;
  try {
    const result = await getAdminVolunteerById(
      request,
      auth.accessToken,
      opportunityId,
    );
    opportunity = result?.opportunity;
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Opportunity not found", { status: 404 });
    }
    throw error;
  }

  if (!opportunity) {
    throw new Response("Opportunity not found", { status: 404 });
  }

  return withAuthData(auth, {
    opportunity,
  } satisfies ManageVolunteerDetailLoaderData);
}
