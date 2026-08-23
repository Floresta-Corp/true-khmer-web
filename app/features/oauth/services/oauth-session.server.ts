import { createCookieSessionStorage } from "react-router";
import { baseCookie } from "~/lib/server/session.server";

// The OAuth popup keeps its own cookie so the token it hands to the client app
// never mixes with the normal user session (__session) or the admin session
// (__admin_session). Nothing outside this feature reads it.
const OAUTH_SESSION_MAX_AGE = 60 * 60 * 24;

const oauthSessionStorage = createCookieSessionStorage({
  cookie: {
    ...baseCookie,
    name: "__oauth_session",
    maxAge: OAUTH_SESSION_MAX_AGE,
  },
});

export type OAuthSessionData = {
  accessToken: string;
  userId: string;
  clientId: string;
};

function getOAuthSession(request: Request) {
  return oauthSessionStorage.getSession(request.headers.get("Cookie"));
}

function readString(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

export async function getOAuthSessionData(
  request: Request,
): Promise<OAuthSessionData | null> {
  const session = await getOAuthSession(request);
  const accessToken = readString(session.get("accessToken"));
  const userId = readString(session.get("userId"));
  const clientId = readString(session.get("clientId"));

  if (!accessToken || !userId || !clientId) return null;

  return { accessToken, userId, clientId };
}

export async function commitOAuthSession(
  request: Request,
  { accessToken, userId, clientId }: OAuthSessionData,
) {
  const session = await getOAuthSession(request);
  session.set("accessToken", accessToken);
  session.set("userId", userId);
  session.set("clientId", clientId);
  return oauthSessionStorage.commitSession(session);
}

export async function destroyOAuthSession(request: Request) {
  const session = await getOAuthSession(request);
  return oauthSessionStorage.destroySession(session);
}
