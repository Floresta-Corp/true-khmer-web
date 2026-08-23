import type { Route } from "project-types/oauth/route/+types/oauth-login";
import { getOAuthUser } from "~/api/oauth/oauth.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { getAccessToken, getUserId } from "~/lib/server/session.server";
import { toOAuthSessionUser } from "../lib/oauth-user";
import { isAllowedOauthOrigin } from "./oauth-origin.server";
import {
  destroyOAuthSession,
  getOAuthSessionData,
} from "./oauth-session.server";

export async function oauthLoginLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const clientName = url.searchParams.get("client_name") ?? "Plumpi";
  const clientId = url.searchParams.get("client_id");
  const rawOrigin = url.searchParams.get("origin");

  if (!isAllowedOauthOrigin(rawOrigin)) {
    return withAuthData(
      {},
      {
        originAllowed: false,
        hasSession: false,
        origin: null,
        clientName,
        user: null,
        accessToken: null,
      },
    );
  }

  const origin = rawOrigin;

  // Prefer the popup's own cookie, written by a previous popup login and only
  // reused for the client it was issued to. Otherwise fall back to the site
  // session this browser may already have.
  const storedSession = await getOAuthSessionData(request);
  const popupSession =
    storedSession && storedSession.clientId === clientId ? storedSession : null;

  const accessToken =
    popupSession?.accessToken ?? (await getAccessToken(request)) ?? null;
  const userId = popupSession?.userId ?? (await getUserId(request));

  // The token is only ever handed to the opener; the user data behind it comes
  // from /sso/users/{userId}.
  const ssoUser =
    accessToken && userId && clientId
      ? await getOAuthUser(request, { userId, clientId })
      : null;

  // A popup cookie that no longer resolves to a user is dead weight.
  const setCookie =
    popupSession && !ssoUser ? await destroyOAuthSession(request) : undefined;

  return withAuthData(
    { setCookie },
    {
      originAllowed: true,
      hasSession: Boolean(ssoUser),
      origin,
      clientName,
      user: ssoUser ? toOAuthSessionUser(ssoUser) : null,
      accessToken: ssoUser ? accessToken : null,
    },
  );
}
