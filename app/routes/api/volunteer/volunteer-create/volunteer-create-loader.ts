import type { Route as VolunteerRoute } from "project-types/volunteer/routes/+types/volunteer.create";
import { redirect } from "react-router";
import { getUserId } from "~/lib/server/session.server";
import { getVolunteerCategories } from "~/services/volunteer/server/volunteer.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";
import type { GetVolunteerCategoriesResponse } from "~/services/volunteer/volunteer-types";
import type { GetVolunteerLocationsResponse } from "~/services/volunteer/types/location";

interface VolunteerLoaderData {
  userId?: string | null;
  locations?: GetVolunteerLocationsResponse;
  categories?: GetVolunteerCategoriesResponse;
}

export default async function volunteerCreateLoader({
  request,
}: VolunteerRoute.LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    redirect("/login?redirectTo=/volunteer/create");
  }
  const [locations, categories] = await Promise.all([
    getVolunteerLocations(request),
    getVolunteerCategories(request),
  ]);

  return {
    userId,
    locations: locations?.data,
    categories: categories?.data,
  } satisfies VolunteerLoaderData;
}
