import type { Route } from "project-types/admin/partners/route/+types/partners.new";

import { requireSuperAdmin } from "~/lib/server/route-guards.server";

const RESTRICTED_MESSAGE = "Partner management is restricted to Super Admins.";

export async function partnerNewLoader({ request }: Route.LoaderArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);
  return null;
}
