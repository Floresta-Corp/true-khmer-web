import type { Route as VolunteerRoute } from "project-types/volunteer/route/+types/volunteer.create";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { getVolunteerCategories } from "~/api/volunteer/volunteer.categories.server";
import { getVolunteerLocations } from "~/api/volunteer/volunteer.location.server";
import type { GetVolunteerCategoriesResponse } from "~/features/volunteer/types/volunteer-types";
import type { GetVolunteerLocationsResponse } from "~/features/volunteer/types/location";
import { requireUser } from "~/lib/server/route-guards.server";

interface VolunteerLoaderData {
  userId?: string | null;
  locations?: GetVolunteerLocationsResponse;
  categories?: GetVolunteerCategoriesResponse;
}

export default async function volunteerCreateLoader({
  request,
}: VolunteerRoute.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;
  if (!userId) {
    return withAuthRedirect(auth, "/login?redirectTo=/volunteer/create");
  }
  const [locations, categories] = await Promise.all([
    getVolunteerLocations(request),
    getVolunteerCategories(request),
  ]);

  return withAuthData(auth, {
    userId,
    locations: locations?.data,
    categories: categories?.data,
  } satisfies VolunteerLoaderData);
}
