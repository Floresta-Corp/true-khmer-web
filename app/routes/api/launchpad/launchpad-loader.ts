import type { Route as LaunchpadRoute } from "project-types/launchpad/routes/+types/launchpad";
import { GetLaunchpadProjectsPaginated } from "~/services/launchpad/server/launchpad.opportunities.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import { getPublicVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";
import { launchpadSortBySchema } from "~/services/launchpad/types/project";

export async function LaunchpadLoader({ request }: LaunchpadRoute.LoaderArgs) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit")) || 9;
  const cursor = url.searchParams.get("cursor") ?? null;
  const categoryId = url.searchParams.get("categoryId") ?? null;
  const cityId = url.searchParams.get("cityId") ?? null;
  const search = url.searchParams.get("search")?.trim() ?? null;
  const sortBy =
    launchpadSortBySchema.safeParse(url.searchParams.get("sortBy")).data ??
    "newest";

  const [projectsRes, categoriesRes, locationsRes] = await Promise.all([
    GetLaunchpadProjectsPaginated(request, {
      limit,
      cursor,
      categoryId,
      cityId,
      search,
      sortBy,
    }),
    getPublicLaunchpadCategories(request),
    getPublicVolunteerLocations(request),
  ]);

  return {
    projects: projectsRes.launchpads,
    categories: categoriesRes?.data?.categories ?? [],
    locations: locationsRes?.data?.locations ?? [],
    nextCursor: projectsRes.nextCursor,
  };
}
