import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAdminMe } from "~/lib/server/auth/admin/api-admin.server";
import { getAdminAccessToken, getAdminUser } from "~/lib/server/session.server";

export async function superAdminLoader({ request }: LoaderFunctionArgs) {
  const admin = await getAdminUser(request);
  if (admin) {
    const { accessToken, setCookie } = await getAdminAccessToken(request);
    if (accessToken) {
      try {
        await getAdminMe(request, accessToken);
        return redirect("/tk-admin", {
          ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}),
        });
      } catch {
        // Session/token is invalid, fall through to show the login page
      }
    }
  }
  return {};
}
