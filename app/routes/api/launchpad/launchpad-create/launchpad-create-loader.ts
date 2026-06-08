import type { Route as LaunchpadCreateRoute } from "project-types/launchpad/routes/+types/launchpad.create";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";

export default async function launchpadCreateLoader({
  request,
}: LaunchpadCreateRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  if (!userId) {
    throw withAuthRedirect(auth, "/login?redirectTo=/launchpad/create");
  }

  const [categories, locations] = await Promise.all([
    getPublicLaunchpadCategories(request),
    getVolunteerLocations(request),
  ]);

  return withAuthData(auth, {
    userId,
    defaultEmail: auth.user.email ?? "",
    categories: categories?.data?.categories ?? [],
    locations: locations?.data?.locations ?? [],
  });
}
