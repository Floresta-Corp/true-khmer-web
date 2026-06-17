import { createCookieSessionStorage } from "react-router";
import { redirect } from "react-router";
import type { AuthTokensResponse } from "~/services/auth/api.server";
import type { AuthenticatedUser } from "./types";
import type { AdminAuthResult } from "./auth/admin/api-admin.server";
import {
  type AdminLoginResponse,
  type AdminRefreshResponse,
  type AdminUser,
} from "~/types/api-client";
import { apiRequestPublic } from "./api-client.server";

export type { AdminAuthResult };
const SESSION_SECRET = process.env.SESSION_SECRET ?? crypto.randomUUID();

if (!process.env.SESSION_SECRET) {
  console.warn(
    "SESSION_SECRET is not set. Using an ephemeral secret; sessions will reset on restart.",
  );
}

const baseCookie = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secrets: [SESSION_SECRET],
  secure: false,
};

const sessionStorage = createCookieSessionStorage({
  cookie: {
    ...baseCookie,
    name: "__session",
    maxAge: 60 * 60 * 24 * 30,
  },
});

const browserSessionStorage = createCookieSessionStorage({
  cookie: { ...baseCookie, name: "__session" },
});

const adminSessionStorage = createCookieSessionStorage({
  cookie: {
    ...baseCookie,
    name: "__admin_session",
    maxAge: 60 * 60 * 24 * 30,
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function commitSession(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  return sessionStorage.commitSession(session);
}

export async function destroySession(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  return sessionStorage.destroySession(session);
}

interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export async function getUser(
  request: Request,
): Promise<AuthenticatedUser | null | SessionUser> {
  const session = await getSession(request);
  return (session.get("user") as AuthenticatedUser) ?? null;
}

export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const user = session.get("user");
  return user ? (user.id as string) : null;
}

function slimUser(user: AuthTokensResponse["user"]) {
  return {
    id: user.id,
    email: user.email,
    name:
      user.name ??
      ([user.firstName, user.lastName].filter(Boolean).join(" ") || undefined),
    avatar: user.avatar ?? undefined,
  };
}

export async function createUserSession(
  request: Request,
  auth: AuthTokensResponse,
  redirectTo: string,
  options: { rememberMe?: boolean } = {},
) {
  const session = await getSession(request);
  const user = auth.user;
  if (!user.id) {
    throw new Error("Cannot create user session: user.id is missing.");
  }

  session.set("accessToken", auth.accessToken);
  session.set("refreshToken", auth.refreshToken);
  session.set("rememberMe", options.rememberMe === true);
  session.set("user", slimUser(user));

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": options.rememberMe
        ? await commitSession(session)
        : await browserSessionStorage.commitSession(session),
    },
  });
}

export async function updateUserSession(
  request: Request,
  user: AuthTokensResponse["user"],
  redirectTo: string,
) {
  const session = await getSession(request);
  if (!user.id) {
    throw new Error("Cannot update user session: user.id is missing.");
  }

  session.set("user", slimUser(user));

  const rememberMe = session.get("rememberMe") === true;

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": rememberMe
        ? await commitSession(session)
        : await browserSessionStorage.commitSession(session),
    },
  });
}

export async function getAccessToken(request: Request) {
  const session = await getSession(request);
  return session.get("accessToken") as string | undefined;
}

export async function getRefreshToken(request: Request) {
  const session = await getSession(request);
  return session.get("refreshToken") as string | undefined;
}

export function isAutoRefreshEnabled(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  return session.get("rememberMe") === true;
}

async function getAdminSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return adminSessionStorage.getSession(cookie);
}

export async function createAdminSession(
  request: Request,
  auth: AdminAuthResult,
  redirectTo: string,
) {
  const session = await getAdminSession(request);
  session.set("adminAccessToken", auth.accessToken);
  session.set("adminRefreshToken", auth.refreshToken);
  session.set("adminAccessTokenExpiresAt", auth.accessTokenExpiresAt);
  session.set("adminRefreshTokenExpiresAt", auth.refreshTokenExpiresAt);
  session.set("admin", auth.admin);

  return redirect(redirectTo, {
    headers: { "Set-Cookie": await adminSessionStorage.commitSession(session) },
  });
}

export async function getAdminAccessToken(
  request: Request,
): Promise<{ accessToken: string | null; setCookie?: string }> {
  const session = await getAdminSession(request);
  const token = session.get("adminAccessToken");
  if (!token) return { accessToken: null };

  const accessExpiresAt = session.get("adminAccessTokenExpiresAt");
  if (accessExpiresAt && new Date(accessExpiresAt) > new Date()) {
    return { accessToken: token };
  }

  const refreshToken = session.get("adminRefreshToken");
  const refreshExpiresAt = session.get("adminRefreshTokenExpiresAt");
  if (
    !refreshToken ||
    (refreshExpiresAt && new Date(refreshExpiresAt) <= new Date())
  ) {
    return { accessToken: null };
  }

  try {
    const refreshed = await refreshAdminToken(request, refreshToken);

    session.set("adminAccessToken", refreshed.accessToken);
    session.set("adminRefreshToken", refreshed.refreshToken);
    session.set(
      "adminAccessTokenExpiresAt",
      refreshed.accessTokenExpiresAt ?? "",
    );
    session.set(
      "adminRefreshTokenExpiresAt",
      refreshed.refreshTokenExpiresAt ?? "",
    );

    const setCookie = await adminSessionStorage.commitSession(session);
    return { accessToken: refreshed.accessToken, setCookie };
  } catch (err) {
    return { accessToken: null };
  }
}

export async function getAdminUser(
  request: Request,
): Promise<AdminUser | null> {
  const session = await getAdminSession(request);
  return session.get("admin") ?? null;
}

export async function refreshAdminToken(
  request: Request,
  refreshToken: string,
): Promise<Omit<AdminLoginResponse, "admin">> {
  const result = await apiRequestPublic<AdminRefreshResponse>(
    request,
    "/admin/refresh",
    {
      method: "POST",
      body: { refreshToken },
    },
  );

  return result.data;
}

export async function destroyAdminSession(request: Request) {
  const session = await getAdminSession(request);
  return redirect("/tk-admin/login", {
    headers: {
      "Set-Cookie": await adminSessionStorage.destroySession(session),
    },
  });
}
