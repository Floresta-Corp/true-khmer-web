import type { Route } from "./+types/api.me";
import { getUser } from "~/lib/session.server";

// GET /api/me — returns the current user as JSON
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);

  if (!user) {
    return Response.json({ authenticated: false, user: null }, { status: 401 });
  }

  return Response.json({ authenticated: true, user });
}
