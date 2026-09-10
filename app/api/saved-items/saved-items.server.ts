import {
  apiRequestWithSession,
  AuthSessionExpiredError,
} from "~/lib/server/api-client.server";

import type {
  GetSavedItemsResponse,
  LocalSavedItemType,
  SavedItemType,
  ToggleSavedItemResponse,
} from "~/features/saved-items/types";

export interface SavedItemsParams {
  type?: SavedItemType;
  cursor?: string;
  limit?: number;
}

/**
 * One request for the whole page: the items for the active tab plus the counts
 * for every tab, so switching tabs never needs a second round trip.
 */
export async function getSavedItems(
  request: Request,
  params: SavedItemsParams = {},
) {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit !== undefined) query.set("limit", String(params.limit));

  const search = query.toString();
  return await apiRequestWithSession<GetSavedItemsResponse>(
    request,
    `/saved-items${search ? `?${search}` : ""}`,
    { method: "GET" },
  );
}

export async function saveItem(
  request: Request,
  type: LocalSavedItemType,
  itemId: string,
) {
  return await apiRequestWithSession<ToggleSavedItemResponse>(
    request,
    `/saved-items/${type}/${itemId}`,
    { method: "POST" },
  );
}

export async function unsaveItem(
  request: Request,
  type: LocalSavedItemType,
  itemId: string,
) {
  return await apiRequestWithSession<ToggleSavedItemResponse>(
    request,
    `/saved-items/${type}/${itemId}`,
    { method: "DELETE" },
  );
}

/**
 * Events live in Plumpi, so they are addressed by slug: the API reads the
 * event from the provider itself rather than trusting anything sent from here.
 */
export async function saveEvent(request: Request, slug: string) {
  return await apiRequestWithSession<ToggleSavedItemResponse>(
    request,
    `/saved-items/event/${encodeURIComponent(slug)}`,
    { method: "POST" },
  );
}

export async function unsaveEvent(request: Request, slug: string) {
  return await apiRequestWithSession<ToggleSavedItemResponse>(
    request,
    `/saved-items/event/${encodeURIComponent(slug)}`,
    { method: "DELETE" },
  );
}

/**
 * The provider ids of the events this viewer has saved, for seeding the
 * bookmark state on the events pages. Signed-out visitors get an empty list
 * rather than an error, since the listing itself is public.
 */
export async function getSavedEventIds(request: Request): Promise<string[]> {
  try {
    const result = await getSavedItems(request, { type: "event", limit: 100 });
    return (result?.data?.items ?? []).map((item) => item.itemId);
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) return [];
    console.error("Could not read saved events:", error);
    return [];
  }
}
