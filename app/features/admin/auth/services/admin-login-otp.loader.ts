import { data, redirect, type LoaderFunctionArgs } from "react-router";
import type { AdminLoginOtpChallengeResponse } from "~/types/api-client";

import { sanitizeRedirectPath } from "~/lib/redirects";
import { getAdminPendingLogin } from "~/lib/server/session.server";

export type AdminOtpLoaderData = Pick<
  AdminLoginOtpChallengeResponse,
  "challengeId" | "expiresAt"
> & {
  rememberMe: boolean;
  redirectTo: string;
};

export async function adminOtpLoader({ request }: LoaderFunctionArgs) {
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
