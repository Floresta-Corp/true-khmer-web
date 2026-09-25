import { getSavedItems } from "~/api/saved-items/saved-items.server";
import type { Route } from "project-types/saved-items/route/+types/saved-items";
import {
  EMPTY_SAVED_ITEM_COUNTS,
  filterIdToItemType,
  type SavedItemCard,
  type SavedItemCounts,
} from "~/features/saved-items/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getReportReasons } from "~/api/reporting/reporting.server";
import type { GetReportingTypesResponse } from "~/types/api-client";

export type SavedItemsLoaderData = {
  saveItem: SavedItemCard[];
  userId: string | null;
  count: SavedItemCounts;
  nextCursor: string | null;
  reportReasons: GetReportingTypesResponse | null;
};

export async function savedItemsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const url = new URL(request.url);

  const result = await getSavedItems(request, {
    type: filterIdToItemType(url.searchParams.get("filter")),
    cursor: url.searchParams.get("cursor") || undefined,
  });

  const reportReasons = await getReportReasons(request);

  return withAuthData(auth, {
    saveItem: result?.data?.items ?? [],
    reportReasons,
    nextCursor: result?.data?.nextCursor ?? null,
    count: result?.data?.counts ?? EMPTY_SAVED_ITEM_COUNTS,
    userId: auth.user.id,
  } satisfies SavedItemsLoaderData);
}
