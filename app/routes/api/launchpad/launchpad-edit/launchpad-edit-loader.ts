import type { Route as LaunchpadEditRoute } from "project-types/launchpad/routes/+types/launchpad.edit.$id";
import { redirect } from "react-router";
import { getUserId, getUser } from "~/lib/server/session.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { GetLaunchpadDetail } from "~/services/launchpad/server/launchpad.opportunities.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";

export default async function launchpadEditLoader({
  request,
  params,
}: LaunchpadEditRoute.LoaderArgs) {
  await requireUser(request);
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login?redirectTo=/launchpad/edit");
  }

  const id = params.id;
  if (!id) {
    throw redirect("/launchpad");
  }

  const user = await getUser(request);

  const [project, categories, locations] = await Promise.all([
    GetLaunchpadDetail(id, request),
    getPublicLaunchpadCategories(request),
    getVolunteerLocations(request),
  ]);

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  return {
    project,
    userId,
    defaultEmail: user?.email ?? "",
    categories: categories?.data?.categories ?? [],
    locations: locations?.data?.locations ?? [],
  };
}
