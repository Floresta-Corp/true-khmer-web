import type { Route as LaunchpadRoute } from "project-types/launchpad/route/+types/launchpad";
import { GetLaunchpadProjectsPaginated, getPublicLaunchpadCategories } from "~/routes/api/launchpad/launchpad.server";
import { getPublicVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";
import { launchpadSortBySchema } from "~/features/launchpad/types";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function launchpadLoader({ request }: LaunchpadRoute.LoaderArgs) {
  const url = new URL(request.url);
  const rawLimit = Number(url.searchParams.get("limit"));
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;
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
