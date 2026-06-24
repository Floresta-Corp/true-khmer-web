import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import type { Route } from "project-types/settings/routes/+types/settings";

export async function loader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  return withAuthData(auth, { email: auth.user.email });
}
