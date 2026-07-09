import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/registrations/route/+types/registrations";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { getPendingPartnerRegistrations } from "~/api/admin/registrations/registrations.server";

const RESTRICTED_MESSAGE =
  "Partner registrations are restricted to Super Admins.";

export async function registrationsLoader({ request }: Route.LoaderArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const partners = getPendingPartnerRegistrations(request, accessToken).then(
    (result) => result.data.partners,
  );

  return data(
    { partners },
    { ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}) },
  );
}
