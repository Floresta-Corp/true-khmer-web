import {
  apiRequestPublic,
  apiRequestWithAccessToken,
} from "~/lib/server/api-client.server";
import type {
  AcceptModeratorInviteRequest,
  DeleteModeratorResponse,
  InviteModeratorResponse,
  ListModeratorsResponse,
  ModeratorResponse,
} from "~/types/api-client";

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

export async function postManageTeam(
  request: Request,
  accessToken: string,
  body: {
    email: string;
  },
) {
  const result = await apiRequestWithAccessToken<ModeratorResponse>(
    request,
    accessToken,
    `/admin/moderator`,
    {
      method: "POST",
      body,
    },
  );
  return result;
}

export async function verifyModeratorInvite(
  request: Request,
  body: AcceptModeratorInviteRequest,
) {
  const result = await apiRequestPublic<InviteModeratorResponse>(
    request,
    `/admin/moderator/accept-invite`,
    {
      method: "POST",
      body,
    },
  );
  return result.data;
}

export async function removeModerator(
  request: Request,
  id: string,
  accessToken: string,
) {
  const result = await apiRequestWithAccessToken<DeleteModeratorResponse>(
    request,
    accessToken,
    `/admin/moderator/${id}`,
    {
      method: "DELETE",
    },
  );
  return result;
}
