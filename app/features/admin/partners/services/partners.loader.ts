import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/partners/route/+types/partners";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { getManagedPartners } from "~/api/admin/partners/partners.server";
import type { PartnerSortField, PartnerSortOrder } from "../types";

const RESTRICTED_MESSAGE = "Partner management is restricted to Super Admins.";

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function partnersLoader({ request }: Route.LoaderArgs) {
  await requireSuperAdmin(request, RESTRICTED_MESSAGE);

  const { accessToken, setCookie } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const page = positiveInteger(url.searchParams.get("page"), 1);
  const search = url.searchParams.get("search")?.trim() || undefined;
  const sortField: PartnerSortField =
    (url.searchParams.get("sortField") as PartnerSortField | null) ||
    "createdAt";
  const sortOrder: PartnerSortOrder =
    (url.searchParams.get("sortOrder") as PartnerSortOrder | null) || "desc";

  const partners = getManagedPartners(
    request,
    { page, search, sortField, sortOrder },
    accessToken,
  ).then((result) => result.data);

  return data(
    {
      partners,
      query: search ?? "",
      sortField,
      sortOrder,
    },
    { ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}) },
  );
}
