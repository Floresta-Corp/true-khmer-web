import { data, redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getManageModTeam } from "~/services/api/admin/manage-mod-team/manage-moderator.server";
import type {
  CursorPagination,
  ListModeratorsResponse,
} from "~/types/api-client";

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export type ManageModTeamLoaderData = {
  moderators: ListModeratorsResponse["moderators"];
  pagination: CursorPagination;
};

export async function manageModTeamLoader({ request }: LoaderFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const limit = Math.min(
    positiveInteger(url.searchParams.get("limit"), 20),
    100,
  );

  const { moderators, pagination } = await getManageModTeam(
    request,
    accessToken,
    { cursor, limit: limit.toString() },
  ).then((result) => result);

  return data<ManageModTeamLoaderData>(
    { moderators, pagination },
    {
      ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}),
    },
  );
}
