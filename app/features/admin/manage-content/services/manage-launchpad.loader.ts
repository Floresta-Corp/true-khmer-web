import type { Route } from "project-types/admin/manage-content/route/+types/manage-launchpad";

import { getAdminLaunchpad } from "~/api/admin/manage-launchpad/manage-launchpad.server";
import { getPublicLaunchpadCategories } from "~/api/launchpad/launchpad.server";
import { getPublicVolunteerLocations } from "~/api/volunteer/volunteer.location.server";
import {
  fromStatusParam,
  launchpadStatusFilterSchema,
} from "~/features/admin/manage-content/types";
import { launchpadSortBySchema } from "~/features/launchpad/types";
import type { Category, LaunchpadSortBy } from "~/features/launchpad/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { AdminLaunchpadPostsResponse } from "~/types/api-client";

const LIMIT = 12;

type City = { id: string; name: string };

export type ManageLaunchpadLoaderData = {
  data: Promise<AdminLaunchpadPostsResponse>;
  categories: Category[];
  cities: City[];
};

export async function manageLaunchpadLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const url = new URL(request.url);
  const parsedSortBy = launchpadSortBySchema.safeParse(
    url.searchParams.get("sortBy"),
  );
  const sortBy: LaunchpadSortBy = parsedSortBy.success
    ? parsedSortBy.data
    : "newest";
  const parsedStatus = launchpadStatusFilterSchema.safeParse(
    fromStatusParam(url.searchParams.get("status")),
  );
  const projects = getAdminLaunchpad(request, auth.accessToken, {
    limit: LIMIT,
    cursor: url.searchParams.get("cursor") || undefined,
    categoryId: url.searchParams.get("categoryId") || undefined,
    cityId: url.searchParams.get("cityId") || undefined,
    search: url.searchParams.get("search")?.trim() || undefined,
    status: parsedStatus.success ? parsedStatus.data : undefined,
    sortBy,
  });

  projects.catch(() => {});

  const [categories, locations] = await Promise.all([
    getPublicLaunchpadCategories(request),
    getPublicVolunteerLocations(request, { limit: 100 }),
  ]);

  return withAuthData(auth, {
    data: projects,
    categories: categories?.data?.categories ?? [],
    cities: locations?.data?.locations ?? [],
  } satisfies ManageLaunchpadLoaderData);
}
