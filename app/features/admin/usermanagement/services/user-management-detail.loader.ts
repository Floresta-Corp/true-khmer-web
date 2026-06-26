import { data, redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getAdminUserManagementDetail } from "~/routes/api/user-management/user-management.server";

export async function userManagementDetailLoader({
  request,
  params,
}: LoaderFunctionArgs) {
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
