import { createCookieSessionStorage } from "react-router";
import { redirect } from "react-router";
import type { AuthTokensResponse } from "~/services/auth/api.server";
import type { AuthenticatedUser } from "./types";
import type { AuthTokenResponse } from "~/types/api-client";
import {
  invalidateAdminMeCache,
  logoutAdmin,
} from "~/api/admin/auth/admin-auth.server";
import {
  type AdminLoginOtpChallengeResponse,
  type AdminLoginResponse,
  type AdminRefreshResponse,
  type AdminUser,
} from "~/types/api-client";
import { apiRequestPublic } from "./api-client.server";

const SESSION_SECRET = process.env.SESSION_SECRET ?? crypto.randomUUID();

if (!process.env.SESSION_SECRET) {
  console.warn(
    "SESSION_SECRET is not set. Using an ephemeral secret; sessions will reset on restart.",
  );
}

// Shared by every cookie store in the app.
export const baseCookie = {
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

const adminBrowserSessionStorage = createCookieSessionStorage({
  cookie: { ...baseCookie, name: "__admin_session" },
});

const adminPendingLoginStorage = createCookieSessionStorage({
  cookie: {
    ...baseCookie,
    name: "__admin_pending_login",
    maxAge: 60 * 5,
  },
});

const twoFactorPendingLoginStorage = createCookieSessionStorage({
  cookie: {
    ...baseCookie,
    name: "__2fa_pending_login",
  },
});

const ADMIN_REFRESH_BUFFER_MS = 60_000;
const adminRefreshPromises = new Map<
  string,
  Promise<Omit<AdminLoginResponse, "admin">>
>();

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

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export async function getUser(
  request: Request,
): Promise<AuthenticatedUser | null | SessionUser> {
  const session = await getSession(request);
  const user = session.get("user");
  if (user) return user as AuthenticatedUser;

  const userId = session.get("userId");
  const email = session.get("email");
  const name = session.get("name");
  const image = session.get("image");
  if (!userId) return null;

  return { id: userId, email, name, image };
}

export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const user = session.get("user");
  if (user) return user.id as string;

  const userId = session.get("userId");
  return userId ?? null;
}

function slimUser(
  user: AuthTokensResponse["user"] | AuthTokenResponse["user"],
) {
  return {
    id: user.id,
    email: user.email,
    name:
      user.name ?? [user.firstName, user.lastName].filter(Boolean).join(" "),
    image: user.image ?? null,
  };
}

export async function createUserSession(
  request: Request,
  auth: AuthTokensResponse | AuthTokenResponse,
  redirectTo: string,
  options: { rememberMe?: boolean; extraSetCookie?: string | string[] } = {},
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

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    options.rememberMe
      ? await commitSession(session)
      : await browserSessionStorage.commitSession(session),
  );
  for (const cookie of Array.isArray(options.extraSetCookie)
    ? options.extraSetCookie
    : options.extraSetCookie
      ? [options.extraSetCookie]
      : []) {
    headers.append("Set-Cookie", cookie);
  }

  return redirect(redirectTo, { headers });
}

export async function commitAuthToSession(
  request: Request,
  auth: AuthTokensResponse | AuthTokenResponse,
  options: { extraSetCookie?: string | string[] } = {},
) {
  const session = await getSession(request);
  const user = auth.user;
  if (!user.id) {
    throw new Error("Cannot update user session: user.id is missing.");
  }

  session.set("accessToken", auth.accessToken);
  session.set("refreshToken", auth.refreshToken);
  session.set("user", slimUser(user));

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    session.get("rememberMe") === true
      ? await commitSession(session)
      : await browserSessionStorage.commitSession(session),
  );
  for (const cookie of Array.isArray(options.extraSetCookie)
    ? options.extraSetCookie
    : options.extraSetCookie
      ? [options.extraSetCookie]
      : []) {
    headers.append("Set-Cookie", cookie);
  }

  return headers;
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
  return adminSessionStorage.getSession(cookie ?? undefined);
}

async function getAdminPendingLoginSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return adminPendingLoginStorage.getSession(cookie ?? undefined);
}

export type PendingAdminLogin = Pick<
  AdminLoginOtpChallengeResponse,
  "challengeId" | "expiresAt"
> & {
  rememberMe: boolean;
};

export async function createAdminPendingLogin(
  request: Request,
  pendingLogin: PendingAdminLogin,
  redirectTo: string,
) {
  const session = await getAdminPendingLoginSession(request);
  session.set("challengeId", pendingLogin.challengeId);
  session.set("expiresAt", pendingLogin.expiresAt);
  session.set("rememberMe", pendingLogin.rememberMe);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await adminPendingLoginStorage.commitSession(session),
    },
  });
}

export async function getAdminPendingLogin(
  request: Request,
): Promise<PendingAdminLogin | null> {
  const session = await getAdminPendingLoginSession(request);
  const challengeId = session.get("challengeId");
  const expiresAt = session.get("expiresAt");
  const rememberMe = session.get("rememberMe") === true;

  if (typeof challengeId !== "string" || typeof expiresAt !== "string") {
    return null;
  }

  if (new Date(expiresAt).getTime() <= Date.now()) {
    return null;
  }

  return { challengeId, expiresAt, rememberMe };
}

export type PendingTwoFactorLogin = {
  twoFactorToken: string;
  methods: string[];
  expiresAt: string;
  rememberMe: boolean;
};

export async function createPendingTwoFactorLogin(
  request: Request,
  pendingLogin: PendingTwoFactorLogin,
  redirectTo: string,
) {
  const expiresInSeconds = Math.max(
    1,
    Math.floor(
      (new Date(pendingLogin.expiresAt).getTime() - Date.now()) / 1000,
    ),
  );
  const session = await twoFactorPendingLoginStorage.getSession(
    request.headers.get("Cookie"),
  );
  session.set("twoFactorToken", pendingLogin.twoFactorToken);
  session.set("methods", pendingLogin.methods);
  session.set("expiresAt", pendingLogin.expiresAt);
  session.set("rememberMe", pendingLogin.rememberMe);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await twoFactorPendingLoginStorage.commitSession(session, {
        maxAge: expiresInSeconds,
      }),
    },
  });
}

export async function getPendingTwoFactorLogin(
  request: Request,
): Promise<PendingTwoFactorLogin | null> {
  const session = await twoFactorPendingLoginStorage.getSession(
    request.headers.get("Cookie"),
  );
  const twoFactorToken = session.get("twoFactorToken");
  const methods = session.get("methods");
  const expiresAt = session.get("expiresAt");
  const rememberMe = session.get("rememberMe") === true;

  if (
    typeof twoFactorToken !== "string" ||
    typeof expiresAt !== "string" ||
    !Array.isArray(methods)
  ) {
    return null;
  }

  if (new Date(expiresAt).getTime() <= Date.now()) {
    return null;
  }

  return {
    twoFactorToken,
    methods: methods.filter(
      (method): method is string => typeof method === "string",
    ),
    expiresAt,
    rememberMe,
  };
}

export async function destroyPendingTwoFactorLogin(request: Request) {
  const session = await twoFactorPendingLoginStorage.getSession(
    request.headers.get("Cookie"),
  );
  return twoFactorPendingLoginStorage.destroySession(session);
}

export async function createAdminSession(
  request: Request,
  auth: AdminLoginResponse,
  redirectTo: string,
  options: { rememberMe?: boolean } = {},
) {
  const session = await getAdminSession(request);
  const pendingLoginSession = await getAdminPendingLoginSession(request);
  session.set("adminAccessToken", auth.accessToken);
  session.set("adminRefreshToken", auth.refreshToken);
  session.set("adminAccessTokenExpiresAt", auth.accessTokenExpiresAt);
  session.set("adminRefreshTokenExpiresAt", auth.refreshTokenExpiresAt);
  session.set("admin", auth.admin);
  session.set("adminRememberMe", options.rememberMe === true);

  const authCookie = options.rememberMe
    ? await adminSessionStorage.commitSession(session)
    : await adminBrowserSessionStorage.commitSession(session);
  const clearPendingCookie =
    await adminPendingLoginStorage.destroySession(pendingLoginSession);

  return redirect(redirectTo, {
    headers: [
      ["Set-Cookie", authCookie],
      ["Set-Cookie", clearPendingCookie],
    ],
  });
}

export async function getAdminAccessToken(
  request: Request,
  options: { forceRefresh?: boolean } = {},
): Promise<{ accessToken: string | null; setCookie?: string }> {
  const session = await getAdminSession(request);
  const token = session.get("adminAccessToken");
  if (!token) return { accessToken: null };

  const accessExpiresAt = session.get("adminAccessTokenExpiresAt");
  if (
    !options.forceRefresh &&
    accessExpiresAt &&
    new Date(accessExpiresAt).getTime() - ADMIN_REFRESH_BUFFER_MS > Date.now()
  ) {
    return { accessToken: token };
  }

  const refreshToken = session.get("adminRefreshToken");
  const refreshExpiresAt = session.get("adminRefreshTokenExpiresAt");
  if (
    !refreshToken ||
    (refreshExpiresAt && new Date(refreshExpiresAt) <= new Date())
  ) {
    invalidateAdminMeCache(token);
    return {
      accessToken: null,
      setCookie: await adminSessionStorage.destroySession(session),
    };
  }

  try {
    const refreshed = await refreshAdminTokenSingleFlight(
      request,
      refreshToken,
    );

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

    const rememberMe = session.get("adminRememberMe") === true;
    const setCookie = rememberMe
      ? await adminSessionStorage.commitSession(session)
      : await adminBrowserSessionStorage.commitSession(session);
    return { accessToken: refreshed.accessToken, setCookie };
  } catch (err) {
    invalidateAdminMeCache(token);
    return {
      accessToken: null,
      setCookie: await adminSessionStorage.destroySession(session),
    };
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

async function refreshAdminTokenSingleFlight(
  request: Request,
  refreshToken: string,
) {
  const existingRefresh = adminRefreshPromises.get(refreshToken);
  if (existingRefresh) return existingRefresh;

  const refreshPromise = refreshAdminToken(request, refreshToken).finally(
    () => {
      adminRefreshPromises.delete(refreshToken);
    },
  );
  adminRefreshPromises.set(refreshToken, refreshPromise);

  return refreshPromise;
}

export async function destroyAdminSession(
  request: Request,
  options: { callApi?: boolean } = {},
) {
  const session = await getAdminSession(request);
  const pendingLoginSession = await getAdminPendingLoginSession(request);
  const accessToken = session.get("adminAccessToken");
  invalidateAdminMeCache(accessToken);

  if (options.callApi && typeof accessToken === "string") {
    try {
      await logoutAdmin(request, accessToken);
    } catch {
      // Local auth state is cleared even when the backend logout request fails.
    }
  }

  return redirect("/tk-admin/login", {
    headers: [
      ["Set-Cookie", await adminSessionStorage.destroySession(session)],
      [
        "Set-Cookie",
        await adminPendingLoginStorage.destroySession(pendingLoginSession),
      ],
    ],
  });
}
