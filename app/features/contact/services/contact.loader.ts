import type { Route } from "project-types/contact/route/+types/contact";
import { getServerEnv } from "~/lib/server/env";
import { getUser } from "~/lib/server/session.server";
import { isContactCategory } from "../lib/contact-schema";

/**
 * Cloudflare's test site key: always passes, for local development. Real
 * deployments set TURNSTILE_SITE_KEY, and the API rejects test tokens there.
 */
const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

/** Prefills the form for signed-in members and from `?topic=`. */
export async function contactLoader({ request }: Route.LoaderArgs) {
  const user = await getUser(request).catch(() => null);
  const topic = new URL(request.url).searchParams.get("topic");

  return {
    prefill: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      category: isContactCategory(topic) ? topic : null,
    },
    isSignedIn: Boolean(user),
    turnstileSiteKey:
      getServerEnv("TURNSTILE_SITE_KEY") ?? TURNSTILE_TEST_SITE_KEY,
  };
}
