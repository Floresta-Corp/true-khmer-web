import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/registrations/route/+types/registrations.partner.$partnerId";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { getPartnerRegistrationDetail } from "~/api/admin/registrations/registrations.server";

const RESTRICTED_MESSAGE =
  "Partner registrations are restricted to Super Admins.";

export async function registrationDetailLoader({
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
    const result = await getPartnerRegistrationDetail(
      request,
      partnerId,
      accessToken,
    );

    const responseCookie = result.setCookie ?? setCookie;
    return data(
      {
        partner: result.data.partner,
        contactPersons: result.data.contactPersons,
      },
      {
        ...(responseCookie
          ? { headers: { "Set-Cookie": responseCookie } }
          : {}),
      },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Partner registration not found", { status: 404 });
    }
    throw error;
  }
}
