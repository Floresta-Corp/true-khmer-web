import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type { ListModeratorsResponse } from "~/types/api-client";

export interface ManageModTeamParams {
  cursor?: string;
  limit?: string;
}

export async function getManageModTeam(
  request: Request,
  accessToken: string,
  params: ManageModTeamParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());

  const qs = queryParams.toString();
  const result = await apiRequestWithAccessToken<ListModeratorsResponse>(
    request,
    accessToken,
    `/admin/moderator${qs ? `?${qs}` : ""}`,
    { method: "GET" },
  );

  return { data: result };
}
