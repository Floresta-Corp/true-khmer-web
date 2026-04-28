import { createCookieSessionStorage } from "react-router";
import { redirect } from "react-router";
import type { AuthTokensResponse } from "~/services/auth.server";
import type { AuthenticatedUser } from "./types";
const SESSION_SECRET = process.env.SESSION_SECRET ?? crypto.randomUUID();

if (!process.env.SESSION_SECRET) {
  console.warn(
    "SESSION_SECRET is not set. Using an ephemeral secret; sessions will reset on restart.",
  );
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: false,
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
  const user = session.get("user");
  if (user) return user as AuthenticatedUser;

  const userId = session.get("userId");
  const email = session.get("email");
  const name = session.get("name");
  const avatar = session.get("avatar");
  if (!userId) return null;

  return { id: userId, email, name, avatar };
}

export async function getUserId(request: Request): Promise<string | null> {
  const session = await getSession(request);
  const user = session.get("user");
  if (user) return user.id as string;

  const userId = session.get("userId");
  if (!userId) return null;

  return userId;
}

export async function createUserSession(
  auth: AuthTokensResponse,
  redirectTo: string,
) {
  const session = await sessionStorage.getSession();
  const user = auth.user;
  if (!user.id) {
    throw new Error("Cannot create user session: user.id is missing.");
  }

  session.set("accessToken", auth.accessToken);
  session.set("refreshToken", auth.refreshToken);
  session.set("user", user);

  session.set("userId", user.id);
  session.set("email", user.email);
  session.set(
    "name",
    user.name ?? [user.firstName, user.lastName].filter(Boolean).join(" "),
  );
  session.set("avatar", user.avatar);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
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
