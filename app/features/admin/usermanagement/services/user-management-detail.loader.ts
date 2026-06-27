import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/usermanagement/route/+types/user-management.$userId";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getAdminUserManagementDetail } from "~/api/admin/user-management/user-management.server";

export async function userManagementDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  if (!params.userId) {
    throw new Response("User ID is required.", { status: 400 });
  }

  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const user = getAdminUserManagementDetail(
    request,
    params.userId,
    accessToken,
  ).then((result) => result.data.user);

  return data(
    { user },
    {
      ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}),
    },
  );
}
