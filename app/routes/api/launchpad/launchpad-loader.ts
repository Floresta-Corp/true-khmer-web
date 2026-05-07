import type { Route as LaunchpadRoute } from "project-types/launchpad/routes/+types/launchpad";
import { GetLaunchpadProjects } from "~/services/launchpad/server/launchpad.opportunities.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import { getPublicVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";
import type { Category } from "~/services/launchpad/types/category";

interface LaunchpadLoaderData {
  projects: Awaited<ReturnType<typeof GetLaunchpadProjects>>;
  categories: Category[];
  locations: Location[];
}

export async function LaunchpadLoader({
  request,
}: LaunchpadRoute.LoaderArgs): Promise<LaunchpadLoaderData> {
  const [projects, categories, locationsRes] = await Promise.all([
    GetLaunchpadProjects(request),
    getPublicLaunchpadCategories(request),
    getPublicVolunteerLocations(request),
  ]);
  return {
    projects,
    categories: categories?.data?.categories ?? [],
    locations: locationsRes?.data?.locations ?? [],
  };
}
