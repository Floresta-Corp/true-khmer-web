import type { Route } from "project-types/oauth/route/+types/oauth-login";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import { getAccessToken } from "~/lib/server/session.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { isAllowedOauthOrigin } from "./oauth-origin.server";

export async function oauthLoginLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const clientName = url.searchParams.get("client_name") ?? "Plumpi";
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
  const { user, setCookie } = await getOptionalUser(request);
  const accessToken = user ? await getAccessToken(request) : undefined;

  return withAuthData(
    { setCookie },
    {
      originAllowed: true,
      hasSession: Boolean(user && accessToken),
      origin,
      clientName,
      user: user
        ? {
            id: user.id,
            name: user.profile.displayName || user.name,
            email: user.email,
          }
        : null,
      accessToken: accessToken ?? null,
    },
  );
}
