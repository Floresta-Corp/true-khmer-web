import { data } from "react-router";
import type { Route } from "project-types/admin/developer-clients/route/+types/developer-clients";

import { getDeveloperClients } from "~/api/admin/developer-clients/developer-clients.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import type {
  DeveloperClientSortField,
  DeveloperClientSortOrder,
  DeveloperClientStatusInput,
} from "../types";

export const RESTRICTED_MESSAGE =
  "Developer client management is restricted to Super Admins.";

const SORT_FIELDS: DeveloperClientSortField[] = ["name", "createdAt"];
const SORT_ORDERS: DeveloperClientSortOrder[] = ["asc", "desc"];
const STATUSES: DeveloperClientStatusInput[] = ["ACTIVE", "DISABLED"];

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/** Ignore unrecognised values rather than passing them through to the API. */
function oneOf<T extends string>(
  value: string | null,
  allowed: T[],
): T | undefined {
  return value && (allowed as string[]).includes(value)
    ? (value as T)
    : undefined;
}

export async function developerClientsLoader({ request }: Route.LoaderArgs) {
  const { accessToken, setCookie } = await requireSuperAdmin(
    request,
    RESTRICTED_MESSAGE,
  );

  const url = new URL(request.url);
  const page = positiveInteger(url.searchParams.get("page"), 1);
  const search = url.searchParams.get("search")?.trim() || undefined;
  const status = oneOf(url.searchParams.get("status"), STATUSES);
  const sortField =
    oneOf(url.searchParams.get("sortField"), SORT_FIELDS) ?? "createdAt";
  const sortOrder =
    oneOf(url.searchParams.get("sortOrder"), SORT_ORDERS) ?? "desc";

  // Deliberately not awaited: the page streams this behind <Suspense>/<Await>.
  const clients = getDeveloperClients(
    request,
    { page, search, status, sortField, sortOrder },
    accessToken,
  ).then((result) => result.data);

  return data(
    {
      clients,
      query: search ?? "",
      status: status ?? "all",
      sortField,
      sortOrder,
    },
    { ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}) },
  );
}
