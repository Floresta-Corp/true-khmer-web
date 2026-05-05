import type { Route as LaunchpadCreateRoute } from "project-types/launchpad/routes/+types/launchpad.create";
import { redirect } from "react-router";
import { getUserId, getUser } from "~/lib/server/session.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";

export default async function launchpadCreateLoader({
  request,
}: LaunchpadCreateRoute.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login?redirectTo=/launchpad/create");
  }

  const user = await getUser(request);

  const [categories, locations] = await Promise.all([
    getPublicLaunchpadCategories(request),
    getVolunteerLocations(request),
  ]);

  return {
    userId,
    defaultEmail: user?.email ?? "",
    categories: categories?.data?.categories ?? [],
    locations: locations?.data?.locations ?? [],
  };
}
