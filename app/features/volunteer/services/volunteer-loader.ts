import type { Route as VolunteerRoute } from "project-types/volunteer/route/+types/volunteer";
import { getUserId } from "~/lib/server/session.server";
import type {
  GetVolunteerCategoriesResponse,
  GetVolunteerLocationsResponse,
  GetVolunteerOpportunitiesResponse,
} from "~/features/volunteer/types/volunteer-types";
import {
  getVolunteerCategories,
  getPublicVolunteerCategories,
  getPublicVolunteerOpportunities,
  getVolunteerOpportunities,
  getVolunteerLocations,
  getPublicVolunteerLocations,
} from "~/api/volunteer/volunteer.server";

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
    categories: categories?.data?.categories,
    opportunities: opportunities?.data?.opportunities,
    pagination: opportunities?.data?.pagination,
    locations: locations?.data?.locations,
    userId: userId,
  } satisfies VolunteerLoaderData;
}

interface VolunteerLoaderData {
  categories:
  | (GetVolunteerCategoriesResponse["categories"] | undefined)
  | undefined;
  opportunities:
  | (GetVolunteerOpportunitiesResponse["opportunities"] | undefined)
  | undefined;
  pagination:
  | (GetVolunteerOpportunitiesResponse["pagination"] | undefined)
  | undefined;
  locations:
  | (GetVolunteerLocationsResponse["locations"] | undefined)
  | undefined;
  userId: string | null;
}
