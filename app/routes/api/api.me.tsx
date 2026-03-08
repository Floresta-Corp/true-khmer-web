import { getUser } from "~/lib/server/session.server";
import type { Route } from "../+types/dashboard";

// GET /api/me — returns the current user as JSON
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);

  if (!user) {
    return Response.json({ authenticated: false, user: null }, { status: 401 });
  }

  return Response.json({ authenticated: true, user });
}
