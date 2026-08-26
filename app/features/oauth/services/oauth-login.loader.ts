import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  getOAuthSessionUser,
  verifyOAuthClient,
} from "~/api/oauth/oauth.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { toOAuthSessionUser } from "../lib/oauth-user";

const UNSAFE_REDIRECT_PROTOCOLS = new Set(["data:", "file:", "javascript:"]);

// Clients have shipped both spellings of these params, so accept either.
function readParam(url: URL, ...names: string[]) {
  for (const name of names) {
    const value = url.searchParams.get(name);
    if (value) return value;
  }
  return null;
}

// The native app owns and supplies its callback URI. The web app only rejects
// malformed or executable destinations before passing the URI to the browser.
function readNativeRedirectUri(url: URL): string | null {
  const value = readParam(url, "redirectUri", "redirect_uri");
  if (!value) return null;

  try {
    const redirectUri = new URL(value.trim());
    if (
      !redirectUri.protocol ||
      UNSAFE_REDIRECT_PROTOCOLS.has(redirectUri.protocol) ||
      redirectUri.username ||
      redirectUri.password
    ) {
      return null;
    }

    return redirectUri.toString();
  } catch {
    return null;
  }
}

export async function OauthLoginLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const clientId = readParam(url, "clientId", "client_id");
  const origin = url.searchParams.get("origin");
  const platform: "native" | "web" =
    url.searchParams.get("platform") === "native" ? "native" : "web";
  const redirectUri = platform === "native" ? readNativeRedirectUri(url) : null;

  // Branding in the query string is only a fallback — the API is what decides
  // whether this origin may talk to this client at all.
  const client =
    clientId && origin
      ? await verifyOAuthClient(request, clientId, origin)
      : null;

  if (!client || !origin || (platform === "native" && !redirectUri)) {
    return withAuthData(
      {},
      {
        originAllowed: false,
        hasSession: false,
        origin: null,
        platform,
        redirectUri: null,
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
      clientId: client.clientId,
      clientName: client.name,
      clientLogo: client.logoUrl ?? readParam(url, "logoUrl", "logo_url"),
      user: user ? toOAuthSessionUser(user) : null,
      accessToken: user ? accessToken : null,
    },
  );
}
