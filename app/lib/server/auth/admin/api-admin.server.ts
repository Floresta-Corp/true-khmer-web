import {
  apiRequestPublic,
  apiRequestWithAccessToken,
} from "~/lib/server/api-client.server";
import { type AdminLoginResponse, type AdminUser } from "~/types/api-client";

export type AdminAuthResult = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  admin: AdminUser;
};

export async function loginAdmin(
  request: Request,
  email: string,
  password: string,
): Promise<AdminAuthResult> {
  const result = await apiRequestPublic<AdminLoginResponse>(
    request,
    "/admin/login",
    {
      method: "POST",
      body: { email, password },
    },
  );

  return result.data;
}

export async function getAdminMe(
  request: Request,
  accessToken: string,
): Promise<AdminUser> {
  const result = await apiRequestWithAccessToken<AdminUser>(
    request,
    accessToken,
    "/admin/me",
  );
  return result;
}
