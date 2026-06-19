import { data, type LoaderFunctionArgs } from "react-router";

import { getAdminUserManagementDetail } from "~/services/api/admin/user-management/user-management.server";

export async function userManagementDetailLoader({
  request,
  params,
}: LoaderFunctionArgs) {
  if (!params.userId) {
    throw new Response("User ID is required.", { status: 400 });
  }

  const result = await getAdminUserManagementDetail(request, params.userId);

  return data(result.data, {
    ...(result.setCookie
      ? { headers: { "Set-Cookie": result.setCookie } }
      : {}),
  });
}
