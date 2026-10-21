import type { Route } from "project-types/contact/route/+types/contact";
import { getUser } from "~/lib/server/session.server";
import { isContactCategory } from "../lib/contact-schema";

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
  };
}
