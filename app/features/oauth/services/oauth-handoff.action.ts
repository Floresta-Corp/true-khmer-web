import type { Route } from "project-types/oauth/route/+types/oauth-handoff";
import {
  apiRequestPublic,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  destroySession,
  getSession,
  refreshSessionTokens,
} from "~/lib/server/session.server";
import type { OAuthHandoffResult } from "../types";

type OAuthHandoffRequestBody = {
  origin?: string;
  clientId?: string;
  accessToken?: string;
};

export type OAuthHandoffFailure = {
  ok: false;
  sessionExpired: boolean;
  origin?: string;
};

export type OAuthHandoffTokens = {
  accessToken: string;
  refreshToken: string;
};

// The API rejected the access token itself, as opposed to failing the exchange
// for some other reason — the one case a refresh can fix.
function isTokenRejected(error: unknown) {
  return (
    error instanceof ProtectedApiError &&
    (error.status === 401 || error.status === 403)
  );
}

async function exchangeForHandoffToken(
  request: Request,
  clientId: string,
  accessToken: string,
) {
  const { data } = await apiRequestPublic<OAuthHandoffResult>(
    request,
    "/sso/handoff",
    {
      method: "POST",
      body: { clientId, accessToken },
    },
  );

  return data;
}

// Both success paths answer with the same shape, so the page never has to guess
// whether a `tokens` field exists on the result it got back.
function handoffSuccess(
  data: OAuthHandoffResult,
  origin: string | undefined,
  tokens?: OAuthHandoffTokens,
) {
  return { ...data, origin, tokens };
}

export async function OauthHandoffAction({ request }: Route.ActionArgs) {
  const { origin, clientId, accessToken } =
    (await request.json()) as OAuthHandoffRequestBody;

  if (!clientId || !accessToken) {
    throw new Response("clientId and accessToken are required.", {
      status: 400,
    });
  }

  try {
    const data = await exchangeForHandoffToken(request, clientId, accessToken);
    return withAuthData({}, handoffSuccess(data, origin));
  } catch (error) {
    if (!isTokenRejected(error)) throw error;
  }

  // The SSO service turned the access token down — the only verdict on it that
  // counts. Spend the session's refresh token and retry once, writing the fresh
  // pair back into `__session` so the normal site session keeps working too.
  const session = await getSession(request);
  const refreshed = await refreshSessionTokens(request, session);

  if (refreshed) {
    try {
      const data = await exchangeForHandoffToken(
        request,
        clientId,
        refreshed.accessToken,
      );
      // The pair the page is holding is the one the SSO service just turned
      // down, so hand back the replacement it accepted: `setCookie` updates
      // `__session` and `tokens` updates the page's own copy.
      return withAuthData(
        { setCookie: refreshed.setCookie },
        handoffSuccess(data, origin, {
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
        }),
      );
    } catch (error) {
      if (!isTokenRejected(error)) throw error;
    }
  }

  // Neither token is any good: clear the site session and tell the page to drop
  // its own copy, which puts the OAuth login form back in front of the user.
  return withAuthData({ setCookie: await destroySession(session) }, {
    ok: false,
    sessionExpired: true,
    origin,
  } satisfies OAuthHandoffFailure);
}
