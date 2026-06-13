import {
  apiRequestPublic,
  apiRequestWithAccessToken,
} from "~/lib/server/api-client.server";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

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
) {
  return apiRequestPublic<AdminAuthResult>(request, "/admin/login", {
    method: "POST",
    body: { email, password },
  });
}

export async function getAdminMe(
  request: Request,
  accessToken: string,
): Promise<AdminUser> {
  return apiRequestWithAccessToken<AdminUser>(
    request,
    accessToken,
    "/admin/me",
  );
}
