import type { Route } from "project-types/admin/manage-content/route/+types/manage-volunteer";

import { getAdminVolunteer } from "~/api/admin/manage-volunteer/manage-volunteer.server";
import {
  getPublicVolunteerCategories,
  getPublicVolunteerLocations,
} from "~/api/volunteer/volunteer.server";
import {
  fromStatusParam,
  volunteerStatusFilterSchema,
} from "~/features/admin/manage-content/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { AdminVolunteerPostsResponse } from "~/types/api-client";

const LIMIT = 12;

type FilterOption = { id: string; name: string };

type CategoryFilterOption = FilterOption & { count: number };

export type ManageVolunteerLoaderData = {
  opportunities: AdminVolunteerPostsResponse["opportunities"];
  pagination: AdminVolunteerPostsResponse["pagination"] | null;
  categories: CategoryFilterOption[];
  locations: FilterOption[];
};

function toFilterOptions(
  items: { id: string; name?: string }[] | undefined,
): FilterOption[] {
  return (items ?? [])
    .filter((item) => Boolean(item.name))
    .map((item) => ({ id: item.id, name: item.name as string }));
}

function toCategoryOptions(
  items: { id: string; name?: string; opportunityCount?: number }[] | undefined,
): CategoryFilterOption[] {
  return (items ?? [])
    .filter((item) => Boolean(item.name))
    .map((item) => ({
      id: item.id,
      name: item.name as string,
      count: item.opportunityCount ?? 0,
    }));
}

export async function manageVolunteerLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const url = new URL(request.url);
  const parsedStatus = volunteerStatusFilterSchema.safeParse(
    fromStatusParam(url.searchParams.get("status")),
  );
  const [opportunities, categories, locations] = await Promise.all([
    getAdminVolunteer(request, auth.accessToken, {
      limit: LIMIT,
      cursor: url.searchParams.get("cursor") || undefined,
      categoryId: url.searchParams.get("categoryId") || undefined,
      locationId: url.searchParams.get("locationId") || undefined,
      search: url.searchParams.get("search")?.trim() || undefined,
      status: parsedStatus.success ? parsedStatus.data : undefined,
    }),
    getPublicVolunteerCategories(request),
    getPublicVolunteerLocations(request),
  ]);

  return withAuthData(auth, {
    opportunities: opportunities?.opportunities ?? [],
    pagination: opportunities?.pagination ?? null,
    categories: toCategoryOptions(categories?.data?.categories),
    locations: toFilterOptions(locations?.data?.locations),
  } satisfies ManageVolunteerLoaderData);
}
