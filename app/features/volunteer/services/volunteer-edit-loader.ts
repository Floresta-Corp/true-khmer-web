import type { Route as VolunteerRoute } from "project-types/volunteer/route/+types/volunteer.edit.$id";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  getOpportunityById,
  getPublicOpportunityById,
} from "~/api/volunteer/volunteer.opportunities.server";
import { getVolunteerCategories } from "~/api/volunteer/volunteer.categories.server";
import { getVolunteerLocations } from "~/api/volunteer/volunteer.location.server";
import { requireUser } from "~/lib/server/route-guards.server";
import type { GetVolunteerCategoriesResponse } from "~/features/volunteer/types/volunteer-types";
import type { GetVolunteerLocationsResponse } from "~/features/volunteer/types/location";

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
  const auth = await requireUser(request);
  const userId = auth.user.id;

  const [volunteer, locations, categories] = await Promise.all([
    userId
      ? getOpportunityById(request, params.id)
      : getPublicOpportunityById(request, params.id),
    getVolunteerLocations(request),
    getVolunteerCategories(request),
  ]);

  return withAuthData(auth, {
    volunteer: volunteer?.data?.opportunity,
    userId,
    locations: locations?.data,
    categories: categories?.data,
  } satisfies VolunteerEditLoaderData);
}
