import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminUpdateProfileRequest,
  AdminUpdateProfileResponse,
} from "~/types/api-client";

export async function updateAdminProfile(
  request: Request,
  accessToken: string,
  payload: AdminUpdateProfileRequest,
): Promise<AdminUpdateProfileResponse> {
  return apiRequestWithAccessToken<AdminUpdateProfileResponse>(
    request,
    accessToken,
    "/admin/profile",
    { method: "PATCH", body: payload },
  );
}
