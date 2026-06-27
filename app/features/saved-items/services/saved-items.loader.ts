import { redirect } from "react-router";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import { getSavedItems } from "~/api/saved-items/saved-items.server";
import type { Route } from "project-types/saved-items/route/+types/saved-items";
import {
  FilterSavedItemSchema,
  type CountSavedItemResponse,
  type ItemElement,
} from "~/features/saved-items/types";
import type { Pagination } from "~/services/types";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import z from "zod";

export type SavedItemsLoaderData = {
  saveItem: ItemElement[];
  userId: string | null;
  count: CountSavedItemResponse;
  pagination: Pagination | null;
};

export async function savedItemsLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const userId = auth.user.id;
  const url = new URL(request.url);

  const filterParam = url.searchParams.get("filter");
  const mappedFilter = filterParam === "launchpad" ? "project" : filterParam;
  const filterResult = mappedFilter
    ? FilterSavedItemSchema.safeParse(mappedFilter)
    : null;
  const filter = filterResult?.success ? filterResult.data : undefined;
  const cursor = url.searchParams.get("cursor") || undefined;

  const result = await getSavedItems(request, {
    filter,
    cursor,
  });

  return withAuthData(auth, {
    saveItem: result?.data?.items ?? [],
    pagination: result?.data?.pagination ?? null,
    count: result?.data?.counts ?? {
      all: 0,
      forum: 0,
      project: 0,
      volunteer: 0,
    },
    userId,
  } satisfies SavedItemsLoaderData);
}
