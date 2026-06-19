import { redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getAdminMe } from "~/services/api/admin/auth/admin-auth.server";

export async function adminLoginLoader({ request }: LoaderFunctionArgs) {
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
