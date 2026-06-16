import {
  apiRequestPublic,
  apiRequestWithAccessToken,
} from "~/lib/server/api-client.server";
import { schemas } from "~/types/api-client";
import type { z } from "zod";

const { AdminUser } = schemas;

export type AdminUser = z.infer<typeof AdminUser>;

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
  type AdminLoginResponse = z.infer<typeof schemas.AdminLoginResponse>;

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
  type AdminMeResponse = z.infer<typeof schemas.AdminUser>;
  const result = await apiRequestWithAccessToken<AdminMeResponse>(
    request,
    accessToken,
    "/admin/me",
  );
  return result;
}
