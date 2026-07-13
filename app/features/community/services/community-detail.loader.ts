import type { Route } from "project-types/community/route/+types/community.$partnerId";
import { redirect } from "react-router";
import { getPublicPartner } from "~/api/partner/partner-directory.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export async function communityDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const partnerId = params.partnerId;
  if (!partnerId) {
    throw new Response("Partner ID is required", { status: 400 });
  }

  try {
    const result = await getPublicPartner(request, partnerId);
    return { partner: result.data.partner, photos: result.data.photos };
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw redirect("/community");
    }
    throw error;
  }
}
