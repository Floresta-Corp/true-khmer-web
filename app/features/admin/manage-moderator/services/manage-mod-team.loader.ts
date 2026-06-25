import { z } from "zod";
import { data, redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAccessToken } from "~/lib/server/session.server";
import { getManageModTeam } from "~/routes/api/manage-moderator/manage-moderator.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import type {
  CursorPagination,
  ListModeratorsResponse,
} from "~/types/api-client";

const urlSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
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
  const { cursor, limit, search } = urlSchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );

  try {
    const { moderators, pagination } = await getManageModTeam(
      request,
      accessToken,
      { cursor, limit: limit.toString(), search },
    );

    return data<ManageModTeamLoaderData>(
      { moderators, pagination },
      { ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}) },
    );
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 401) {
      throw redirect("/tk-admin/login");
    }
    throw err;
  }
}
