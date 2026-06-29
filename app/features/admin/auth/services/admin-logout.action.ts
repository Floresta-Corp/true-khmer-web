import type { Route } from "project-types/admin/auth/route/+types/admin-logout";

import { destroyAdminSession } from "~/lib/server/session.server";

export async function adminLogoutAction({ request }: Route.ActionArgs) {
  return destroyAdminSession(request, { callApi: true });
}

export async function adminLogoutLoader({ request }: Route.LoaderArgs) {
  return destroyAdminSession(request, { callApi: false });
}
