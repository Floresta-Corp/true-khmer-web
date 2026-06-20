import { data, redirect, type LoaderFunctionArgs } from "react-router";
import type { ListModeratorsResponse } from "~/types/api-client";
import { getManageModTeam } from "~/services/api/admin/manage-mod-team/manage-mod-team.server";
import { getAdminAccessToken } from "~/lib/server/session.server";

export type ManageModTeamLoaderData = {
  moderators: ListModeratorsResponse["moderators"];
  pagination: ListModeratorsResponse["pagination"];
};

export async function manageModTeamLoader({ request }: LoaderFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const limit = url.searchParams.get("limit") ?? "20";

  const result = await getManageModTeam(request, accessToken, {
    cursor,
    limit,
  });

  const { data: apiData } = result;

  return data(
    {
      moderators: apiData.moderators ?? [],
      pagination: apiData.pagination,
    } satisfies ManageModTeamLoaderData,
    {
      headers: setCookie ? { "Set-Cookie": setCookie } : {},
    },
  );
}
