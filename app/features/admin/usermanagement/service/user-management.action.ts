import { data, type ActionFunctionArgs } from "react-router";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";

export async function userManagementAction({
  request,
}: ActionFunctionArgs) {
  await requireSuperAdmin(request);

  return data(
    {
      ok: false,
      error: "User management mutations are not implemented yet.",
    },
    { status: 405 },
  );
}
