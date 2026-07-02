import { data } from "react-router";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { Route } from "project-types/admin/account-settings/route/+types/account-settings";

export async function accountSettingsLoader({ request }: Route.LoaderArgs) {
  const { admin, setCookie } = await requireAdmin(request);

  return data(
    { admin },
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}
