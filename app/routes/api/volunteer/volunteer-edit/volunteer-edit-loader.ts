import type { Route as VolunteerRoute } from "project-types/volunteer/routes/+types/volunteer.edit.$id";
import { getUserId } from "~/lib/server/session.server";
import {
  getOpportunityById,
  getPublicOpportunityById,
} from "~/services/volunteer/server/volunteer.opportunities.server";
import { getVolunteerCategories } from "~/services/volunteer/server/volunteer.categories.server";
import { getVolunteerLocations } from "~/services/volunteer/server/volunteer.location.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import type { GetVolunteerCategoriesResponse } from "~/services/volunteer/volunteer-types";
import type { GetVolunteerLocationsResponse } from "~/services/volunteer/types/location";

interface VolunteerEditLoaderData {
  volunteer?: Record<string, unknown>;
  userId?: string | null;
  locations?: GetVolunteerLocationsResponse;
  categories?: GetVolunteerCategoriesResponse;
}

export default async function volunteerEditLoader({
  request,
  params,
}: VolunteerRoute.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);

  const [volunteer, locations, categories] = await Promise.all([
    userId
      ? getOpportunityById(request, params.id)
      : getPublicOpportunityById(request, params.id),
    getVolunteerLocations(request),
    getVolunteerCategories(request),
  ]);

  return {
    volunteer: volunteer?.data?.opportunity,
    userId,
    locations: locations?.data,
    categories: categories?.data,
  } satisfies VolunteerEditLoaderData;
}
