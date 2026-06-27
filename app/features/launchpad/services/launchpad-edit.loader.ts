import type { Route as LaunchpadEditRoute } from "project-types/launchpad/route/+types/launchpad.edit.$id";
import { requireUser } from "~/lib/server/route-guards.server";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { GetLaunchpadDetail, getPublicLaunchpadCategories } from "~/api/launchpad/launchpad.server";
import { getVolunteerLocations } from "~/api/volunteer/volunteer.location.server";

export default async function launchpadEditLoader({
  request,
  params,
}: LaunchpadEditRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const id = params.id;
  const redirectTo = id ? `/launchpad/edit/${id}` : "/launchpad";

  if (!userId) {
    throw withAuthRedirect(
      auth,
      `/login?${new URLSearchParams({ redirectTo })}`,
    );
  }

  if (!id) {
    throw withAuthRedirect(auth, redirectTo);
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
