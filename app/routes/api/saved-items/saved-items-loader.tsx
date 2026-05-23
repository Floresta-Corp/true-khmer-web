import { redirect } from "react-router";
import { AuthSessionExpiredError } from "~/lib/server/api-client.server";
import { getSavedItems } from "~/services/saved-items/saved-items.server";
import type { Route } from "project-types/saved-items/routes/+types/saved-items";
import {
  FilterSavedItemSchema,
  type GetSavedItemsResponse,
  type ItemElement,
} from "~/services/saved-items/saved-items-types";
import type { Pagination } from "~/services/types";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { getUserId } from "~/lib/server/session.server";
import z from "zod";
type SavedItemsLoaderData = {
  saveItem: ItemElement[];
  userId: string | null;
  pagination: Pagination | null;
};

export async function savedItemsLoader({ request }: Route.LoaderArgs) {
  await requireAuthenticatedUser(request);
  const userId = await getUserId(request);

  if (!userId) {
    return {
      saveItem: [],
      userId: null,
      pagination: null,
    } satisfies SavedItemsLoaderData;
  }

  const url = new URL(request.url);

  const filterParam = url.searchParams.get("filter");
  const mappedFilter = filterParam === "launchpad" ? "project" : filterParam;
  const filterResult = mappedFilter
    ? FilterSavedItemSchema.safeParse(mappedFilter)
    : null;
  const filter = filterResult?.success ? filterResult.data : undefined;
  const pageParam = url.searchParams.get("page");
  const page = pageParam
    ? z.coerce.number().int().positive().safeParse(pageParam).data
    : undefined;

  const result = await getSavedItems(request, {
    filter,
    page,
  });

  return {
    saveItem: result?.data?.items ?? [],
    pagination: result?.data?.pagination ?? null,
    userId,
  } satisfies SavedItemsLoaderData;
}
