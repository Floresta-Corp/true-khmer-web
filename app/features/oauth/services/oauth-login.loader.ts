import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  getOAuthSessionUser,
  verifyOAuthClient,
} from "~/api/oauth/oauth.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { toOAuthSessionUser } from "../lib/oauth-user";

// Clients have shipped both spellings of these params, so accept either.
function readParam(url: URL, ...names: string[]) {
  for (const name of names) {
    const value = url.searchParams.get(name);
    if (value) return value;
  }
  return null;
}

export async function OauthLoginLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const clientId = readParam(url, "clientId", "client_id");
  const origin = url.searchParams.get("origin");

  // Branding in the query string is only a fallback — the API is what decides
  // whether this origin may talk to this client at all.
  const client =
    clientId && origin
      ? await verifyOAuthClient(request, clientId, origin)
      : null;

  if (!client || !origin) {
    return withAuthData(
      {},
      {
        originAllowed: false,
        hasSession: false,
        origin: null,
        clientId,
        clientName: readParam(url, "clientName", "client_name"),
        clientLogo: readParam(url, "logoUrl", "logo_url", "clientLogo"),
        user: null,
        accessToken: null,
        refreshToken: null,
      },
    );
  }

  // Use whatever the browser is already logged in with — there is no separate
  // popup session anymore. The pair is passed through untouched; /sso/handoff
  // is the only thing that can tell whether it is still good.
  const { user, accessToken, refreshToken } =
    await getOAuthSessionUser(request);

  return withAuthData(
    {},
    {
      originAllowed: true,
      hasSession: Boolean(user && accessToken),
      origin,
      clientId: client.clientId,
      clientName: client.name,
      clientLogo: client.logoUrl ?? readParam(url, "logoUrl", "logo_url"),
      user: user ? toOAuthSessionUser(user) : null,
      accessToken: user ? accessToken : null,
      refreshToken: user ? refreshToken : null,
    },
  );
}
