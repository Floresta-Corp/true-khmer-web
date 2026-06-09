import type { Route as VolunteerRoute } from "project-types/volunteer/routes/+types/volunteer.create";
import {
  withAuthData,
  withAuthRedirect,
} from "~/lib/server/auth-response.server";
import { getVolunteerCategories } from "~/services/volunteer/server/volunteer.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";
import type { GetVolunteerCategoriesResponse } from "~/services/volunteer/volunteer-types";
import type { GetVolunteerLocationsResponse } from "~/services/volunteer/types/location";
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
