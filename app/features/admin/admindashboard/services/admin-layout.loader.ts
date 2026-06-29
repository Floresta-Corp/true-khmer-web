import { data } from "react-router";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import type { Route } from "project-types/admin/admindashboard/route/+types/admin-layout";

export async function adminLayoutLoader({ request }: Route.LoaderArgs) {
  const { admin, setCookie } = await requireSuperAdmin(request);

  return data(
    { admin },
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}
