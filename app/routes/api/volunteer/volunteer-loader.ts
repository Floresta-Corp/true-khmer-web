import type { Route as VolunteerRoute } from "project-types/volunteer/routes/+types/volunteer";
import { getUserId } from "~/lib/server/session.server";
import type {
  GetVolunteerCategoriesResponse,
  GetVolunteerLocationsResponse,
  GetVolunteerOpportunitiesResponse,
} from "~/services/volunteer/volunteer-types";
import {
  getVolunteerCategories,
  getPublicVolunteerCategories,
  getPublicVolunteerOpportunities,
  getVolunteerOpportunities,
  getVolunteerLocations,
  getPublicVolunteerLocations,
} from "~/services/volunteer/volunteer.server";

export async function volunteerLoader({ request }: VolunteerRoute.LoaderArgs) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const locationId = url.searchParams.get("locationId") ?? undefined;
  const categoryId = url.searchParams.get("categoryId") ?? undefined;
  const limit = url.searchParams.get("limit");
  const search = url.searchParams.get("search")?.trim() || undefined;

  const filter = {
    cursor,
    locationId,
    categoryId,
    limit: limit ? Number(limit) : undefined,
    search,
  };

  const userId = await getUserId(request);
  const [categories, opportunities, locations] = userId
    ? await Promise.all([
        getVolunteerCategories(request),
        getVolunteerOpportunities(request, filter),
        getVolunteerLocations(request),
      ])
    : await Promise.all([
        getPublicVolunteerCategories(request),
        getPublicVolunteerOpportunities(request, filter),
        getPublicVolunteerLocations(request),
      ]);
  return {
    categories: categories?.data,
    opportunities: opportunities?.data,
    locations: locations?.data,
    userId: userId,
  };
}

interface VolunteerLoaderData {
  categories: GetVolunteerCategoriesResponse;
  opportunities: GetVolunteerOpportunitiesResponse;
  locations: GetVolunteerLocationsResponse;
  userId: string | null;
}
