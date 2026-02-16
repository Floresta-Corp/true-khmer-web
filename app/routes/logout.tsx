import type { Route } from "./+types/logout";
import { getSession, destroySession } from "~/lib/session.server";
import { redirect } from "react-router";

// Logout only works via POST (for CSRF safety)
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

// If someone navigates to /logout via GET, redirect to home
export async function loader() {
  return redirect("/");
}
