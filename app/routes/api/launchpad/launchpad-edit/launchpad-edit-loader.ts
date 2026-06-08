import type { Route as LaunchpadEditRoute } from "project-types/launchpad/routes/+types/launchpad.edit.$id";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { GetLaunchpadDetail } from "~/services/launchpad/server/launchpad.opportunities.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";

export default async function launchpadEditLoader({
  request,
  params,
}: LaunchpadEditRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;

  if (!userId) {
    throw withAuthRedirect(auth, "/login?redirectTo=/launchpad/edit");
  }

  const id = params.id;
  if (!id) {
    throw withAuthRedirect(auth, "/launchpad");
  }
  const [project, categories, locations] = await Promise.all([
    GetLaunchpadDetail(id, request),
    getPublicLaunchpadCategories(request),
    getVolunteerLocations(request),
  ]);

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  return withAuthData(auth, {
    project,
    userId,
    defaultEmail: auth.user.email ?? "",
    categories: categories?.data?.categories ?? [],
    locations: locations?.data?.locations ?? [],
  });
}
