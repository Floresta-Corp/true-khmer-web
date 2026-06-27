import { data } from "react-router";
import type { Route } from "project-types/admin/usermanagement/route/+types/user-management";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";

export async function userManagementAction({ request }: Route.ActionArgs) {
  await requireSuperAdmin(request);

  return data(
    {
      ok: false,
      error: "User management mutations are not implemented yet.",
    },
    { status: 405 },
  );
}
