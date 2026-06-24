import { z } from "zod";
import { data, redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getManageModTeam } from "~/services/api/admin/manage-mod-team/manage-moderator.server";
import type {
  CursorPagination,
  ListModeratorsResponse,
} from "~/types/api-client";

const urlSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

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
  const { cursor, limit } = urlSchema.parse(
    Object.fromEntries(url.searchParams.entries()),
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
