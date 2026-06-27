import {
  apiRequestPublic,
  apiRequestWithAccessToken,
} from "~/lib/server/api-client.server";
import {
  type AdminLoginOtpChallengeResponse,
  type AdminLoginRequest,
  type AdminLoginResponse,
  type AdminUser,
  type AdminVerifyLoginOtpRequest,
} from "~/types/api-client";

const ADMIN_ME_CACHE_TTL_MS = 60_000;
const ADMIN_ME_CACHE_MAX_ENTRIES = 500;

type AdminMeCacheEntry = {
  admin: AdminUser;
  expiresAt: number;
};

const adminMeCache = new Map<string, AdminMeCacheEntry>();

function getCachedAdminMe(accessToken: string) {
  const cached = adminMeCache.get(accessToken);
  if (!cached) return null;

  if (cached.expiresAt <= Date.now()) {
    adminMeCache.delete(accessToken);
    return null;
  }

  adminMeCache.delete(accessToken);
  adminMeCache.set(accessToken, cached);
  return cached.admin;
}

function setCachedAdminMe(accessToken: string, admin: AdminUser) {
  adminMeCache.set(accessToken, {
    admin,
    expiresAt: Date.now() + ADMIN_ME_CACHE_TTL_MS,
  });

  while (adminMeCache.size > ADMIN_ME_CACHE_MAX_ENTRIES) {
    const oldest = adminMeCache.keys().next();
    if (oldest.done) break;
    adminMeCache.delete(oldest.value);
  }
}

export function invalidateAdminMeCache(accessToken: string | null | undefined) {
  if (accessToken) adminMeCache.delete(accessToken);
}

export async function loginAdmin(
  request: Request,
  email: AdminLoginRequest["email"],
  password: AdminLoginRequest["password"],
): Promise<AdminLoginOtpChallengeResponse> {
  const result = await apiRequestPublic<AdminLoginOtpChallengeResponse>(
    request,
    "/admin/login",
    {
      method: "POST",
      body: { email, password },
    },
  );

  return result.data;
}

export async function verifyAdminLoginOtp(
  request: Request,
  challengeId: AdminVerifyLoginOtpRequest["challengeId"],
  otp: AdminVerifyLoginOtpRequest["otp"],
): Promise<AdminLoginResponse> {
  const result = await apiRequestPublic<AdminLoginResponse>(
    request,
    "/admin/login/verify-otp",
    {
      method: "POST",
      body: { challengeId, otp },
    },
  );

  return result.data;
}

export async function logoutAdmin(request: Request, accessToken: string) {
  await apiRequestWithAccessToken(request, accessToken, "/admin/logout", {
    method: "POST",
  });
}

export async function getAdminMe(
  request: Request,
  accessToken: string,
): Promise<AdminUser> {
  const cached = getCachedAdminMe(accessToken);
  if (cached) return cached;

  const result = await apiRequestWithAccessToken<AdminUser>(
    request,
    accessToken,
    "/admin/me",
  );
  setCachedAdminMe(accessToken, result);
  return result;
}
