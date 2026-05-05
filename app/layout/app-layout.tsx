import { Outlet, data, useLoaderData, useLocation } from "react-router";
import { Navbar } from "~/components/navbar";
import type { Route } from "./+types/app-layout";
import { getOptionalUser } from "~/lib/server/route-guards.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { user, setCookie } = await getOptionalUser(request);
  return data(
    { user: user },
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <>
      <Navbar user={user} loginRedirectTo={location.pathname} />
      <Outlet />
    </>
  );
}
