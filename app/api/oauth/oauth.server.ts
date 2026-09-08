import {
  apiRequestPublic,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getSession, type SessionUser } from "~/lib/server/session.server";

export type OAuthSessionResolution = {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const NO_SESSION: OAuthSessionResolution = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

// The account every login path (password, OTP verify, register) already wrote
// into the `__session` cookie. Reading it lets the authorization page pick up a
// session the signup flow just created as soon as the redirect lands back here.
function readSessionUser(
  session: Awaited<ReturnType<typeof getSession>>,
): SessionUser | null {
  const user = session.get("user") as SessionUser | undefined;
  if (!user?.id || !user.email) return null;

  return user;
}

// Hands over whatever the browser's normal site session holds, as-is. Nothing
// here tries to judge whether the tokens are still good: this app's own API is
// a different service from the SSO one, so only /sso/handoff can say. The
// handoff refreshes the pair or clears it when it turns one down.
export async function getOAuthSessionUser(
  request: Request,
): Promise<OAuthSessionResolution> {
  const session = await getSession(request);
  const accessToken = session.get("accessToken") as string | undefined;
  const refreshToken =
    (session.get("refreshToken") as string | undefined) ?? null;
  const user = readSessionUser(session);

  if (!accessToken || !user) return NO_SESSION;

  return { user, accessToken, refreshToken };
}

export type OAuthClient = {
  clientId: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
};

type VerifyClientResponse = {
  ok: boolean;
  client: OAuthClient;
};

// The public client lookup doubles as the origin check: the API only answers
// when `origin` is one the client registered, so a 404 means this page has no
// business posting a handoff token back to whoever opened it.
export async function verifyOAuthClient(
  request: Request,
  clientId: string,
  origin: string,
): Promise<OAuthClient | null> {
  try {
    const { data } = await apiRequestPublic<VerifyClientResponse>(
      request,
      `/sso/clients/${encodeURIComponent(clientId)}?origin=${encodeURIComponent(origin)}`,
      { method: "GET" },
    );

    if (!data?.ok || !data.client?.clientId) return null;

    return data.client;
  } catch (error) {
    if (
      error instanceof ProtectedApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      return null;
    }
    throw error;
  }
}
