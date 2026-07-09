import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/partners/route/+types/partners.$partnerId";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { getManagedPartner } from "~/api/admin/partners/partners.server";

const RESTRICTED_MESSAGE = "Partner management is restricted to Super Admins.";

export async function partnerDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const partnerId = params.partnerId;
  if (!partnerId) {
    throw new Response("Partner ID is required", { status: 400 });
  }

  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  try {
    const result = await getManagedPartner(request, partnerId, accessToken);

    if (result.data.partner.status === "PENDING") {
      throw new Response("Partner is still pending approval", {
        status: 403,
      });
    }

    const responseCookie = result.setCookie ?? setCookie;
    return data(
      {
        partner: result.data.partner,
        contactPersons: result.data.contactPersons,
        photos: result.data.photos,
      },
      {
        ...(responseCookie
          ? { headers: { "Set-Cookie": responseCookie } }
          : {}),
      },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Partner not found", { status: 404 });
    }
    throw error;
  }
}
