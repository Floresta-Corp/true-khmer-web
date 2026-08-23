import type { Route } from "./+types/logout";
import { getSession, destroySession } from "~/lib/server/session.server";
import { withAuthRedirect } from "~/lib/server/auth-response.server";
import { destroyOAuthSession } from "~/features/oauth/services/oauth-session.server";
import { redirect } from "react-router";

export function meta() {
  return [{ title: "Logout | True Khmer" }];
}

// Logout only works via POST (for CSRF safety)
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request);
  // The OAuth popup keeps its own cookie, so clear that here too.
  return withAuthRedirect(
    {
      setCookie: [
        await destroySession(session),
        await destroyOAuthSession(request),
      ],
    },
    "/login",
  );
}

// If someone navigates to /logout via GET, redirect to home
export async function loader() {
  return redirect("/");
}
