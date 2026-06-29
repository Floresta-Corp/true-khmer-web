import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/auth/route/+types/admin-login-otp";

import { sanitizeRedirectPath } from "~/lib/redirects";
import { getAdminPendingLogin } from "~/lib/server/session.server";
import type { AdminOtpLoaderData } from "../types";

export type { AdminOtpLoaderData } from "../types";

export async function adminOtpLoader({ request }: Route.LoaderArgs) {
  const pendingLogin = await getAdminPendingLogin(request);
  if (!pendingLogin) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const redirectTo = sanitizeRedirectPath(
    url.searchParams.get("redirectTo") ?? undefined,
    "/tk-admin",
  );

  return data<AdminOtpLoaderData>({
    ...pendingLogin,
    redirectTo: redirectTo || "/tk-admin",
  });
}
