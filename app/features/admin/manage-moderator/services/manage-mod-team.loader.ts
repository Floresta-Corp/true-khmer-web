import { z } from "zod";
import { data, redirect, type LoaderFunctionArgs } from "react-router";

import { getAdminAccessToken, getAdminUser } from "~/lib/server/session.server";
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
  role: z
    .enum(["moderator", "super_admin"])
    .optional()
    .transform((v) => v?.toUpperCase() as "MODERATOR" | "SUPER_ADMIN" | undefined),
});

export type ManageModTeamLoaderData = {
  moderators: ListModeratorsResponse["moderators"];
  pagination: CursorPagination;
  currentUserId: string;
};

export async function manageModTeamLoader({ request }: LoaderFunctionArgs) {
  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }

  const url = new URL(request.url);
  const { cursor, limit, search, role } = urlSchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );

  try {
    const { moderators, pagination } = await getManageModTeam(
      request,
      accessToken,
      { cursor, limit: limit.toString(), search, role },
    );

    const currentAdmin = await getAdminUser(request);

    return data<ManageModTeamLoaderData>(
      {
        moderators,
        pagination,
        currentUserId: currentAdmin?.id ?? "",
      },
      { ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}) },
    );
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 401) {
      throw redirect("/tk-admin/login");
    }
    throw err;
  }
}
