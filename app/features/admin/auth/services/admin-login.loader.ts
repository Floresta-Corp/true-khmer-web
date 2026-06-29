import { redirect } from "react-router";
import type { Route } from "project-types/admin/auth/route/+types/admin-login";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getAdminMe } from "~/api/admin/auth/admin-auth.server";

export async function adminLoginLoader({ request }: Route.LoaderArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) return {};

  try {
    await getAdminMe(request, accessToken);
    return redirect("/tk-admin", {
      ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}),
    });
  } catch {
    return {};
  }
}
