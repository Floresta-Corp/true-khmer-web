import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  getOAuthSessionUser,
  verifyOAuthClient,
} from "~/api/oauth/oauth.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { readNativeRedirectUri } from "../lib/native-redirect";
import { toOAuthSessionUser } from "../lib/oauth-user";

// Clients have shipped both spellings of these params, so accept either.
function readParam(url: URL, ...names: string[]) {
  for (const name of names) {
    const value = url.searchParams.get(name);
    if (value) return value;
  }
  return null;
}

type OAuthPlatform = "web" | "native";

function readPlatform(url: URL): OAuthPlatform {
  return url.searchParams.get("platform")?.toLowerCase() === "native"
    ? "native"
    : "web";
}

function readState(url: URL): string | null {
  const state = url.searchParams.get("state")?.trim();
  return state && state.length >= 16 && state.length <= 256 ? state : null;
}

export async function OauthLoginLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const clientId = readParam(url, "clientId", "client_id");
  const origin = url.searchParams.get("origin");
  const platform = readPlatform(url);
  const state = platform === "native" ? readState(url) : null;
  const redirectUri =
    platform === "native"
      ? readNativeRedirectUri(
          readParam(
            url,
            "redirectUri",
            "redirect_uri",
            "callbackUri",
            "callback_uri",
          ),
          process.env.NODE_ENV === "development",
        )
      : null;

  // Branding in the query string is only a fallback — the API is what decides
  // whether this origin may talk to this client at all.
  const client =
    clientId && origin
      ? await verifyOAuthClient(request, clientId, origin)
      : null;

  if (
    !client ||
    !origin ||
    (platform === "native" && (!redirectUri || !state))
  ) {
    return withAuthData(
      {},
      {
        originAllowed: false,
        hasSession: false,
        origin: null,
        platform,
        redirectUri: null,
        state: null,
        clientId,
        clientName: readParam(url, "clientName", "client_name"),
        clientLogo: readParam(url, "logoUrl", "logo_url", "clientLogo"),
        user: null,
        accessToken: null,
      },
    );
  }

  // Use whatever the browser is already logged in with — there is no
  // separate popup session anymore.
  const { user, accessToken, setCookie } = await getOAuthSessionUser(request);

  return withAuthData(
    { setCookie },
    {
      originAllowed: true,
      hasSession: Boolean(user && accessToken),
      origin,
      platform,
      redirectUri,
      state,
      clientId: client.clientId,
      clientName: client.name,
      clientLogo: client.logoUrl ?? readParam(url, "logoUrl", "logo_url"),
      user: user ? toOAuthSessionUser(user) : null,
      accessToken: user ? accessToken : null,
    },
  );
}
