import { apiRequestWithSession } from "~/lib/server/api-client.server";

import type {
  FilterSavedItem,
  GetSavedItemsResponse,
  GetSavedLaunchpadOpportunitiesResponse,
  GetSavedVolunteerOpportunitiesResponse,
  GetSaveForumQuestionResponse,
} from "~/features/saved-items/types";

export interface SavedItemsParams {
  filter?: FilterSavedItem;
  cursor?: string;
  limit?: number;
}

export async function getSavedForums(request: Request) {
  return await apiRequestWithSession<GetSaveForumQuestionResponse>(
    request,
    "/forum/questions/saved",
    { method: "GET" },
  );
}

export async function getSavedVolunteers(request: Request) {
  return await apiRequestWithSession<GetSavedVolunteerOpportunitiesResponse>(
    request,
    "/volunteer/saved",
    { method: "GET" },
  );
}

export async function getSavedLaunchpads(request: Request) {
  return await apiRequestWithSession<GetSavedLaunchpadOpportunitiesResponse>(
    request,
    "/launchpad/saved",
    { method: "GET" },
  );
}

export async function getSavedItems(
  request: Request,
  params: SavedItemsParams,
) {
  const queryParams = new URLSearchParams();
  if (params.filter) queryParams.set("filter", params.filter);
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());

  const result = await apiRequestWithSession<GetSavedItemsResponse>(
    request,
    `/me/saved?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );
  return result;
}
