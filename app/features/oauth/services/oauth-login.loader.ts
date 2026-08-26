import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  getOAuthSessionUser,
  verifyAndroidOAuthClient,
  verifyIosOAuthClient,
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

type OAuthPlatform = "web" | "ios" | "android";

function readPlatform(url: URL): OAuthPlatform {
  const platform = url.searchParams.get("platform")?.toLowerCase();
  return platform === "ios" || platform === "android" ? platform : "web";
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
  const state = platform === "web" ? null : readState(url);

  let client = null;
  if (clientId && platform === "web" && origin) {
    client = await verifyOAuthClient(request, clientId, origin);
  } else if (clientId && platform === "ios" && state) {
    const bundleIdentifier = url.searchParams.get("bundleIdentifier");
    const urlScheme = url.searchParams.get("urlScheme");
    if (bundleIdentifier && urlScheme) {
      client = await verifyIosOAuthClient(
        request,
        clientId,
        bundleIdentifier,
        urlScheme,
      );
    }
  } else if (clientId && platform === "android" && state) {
    const packageName = url.searchParams.get("packageName");
    const sha1CertificateFingerprint = url.searchParams.get(
      "sha1CertificateFingerprint",
    );
    if (packageName && sha1CertificateFingerprint) {
      client = await verifyAndroidOAuthClient(
        request,
        clientId,
        packageName,
        sha1CertificateFingerprint,
      );
    }
  }

  const redirectUri = platform === "web" ? null : (client?.redirectUri ?? null);

  if (
    !client ||
    (platform === "web" && !origin) ||
    (platform !== "web" && (!redirectUri || !state))
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
