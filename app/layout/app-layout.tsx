import { Outlet, data, useLoaderData } from "react-router";
import { Navbar } from "~/components/navbar";
import type { Route } from "./+types/app-layout";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import { Footer } from "~/components/footer";

export async function loader({ request }: Route.LoaderArgs) {
  const result = await getOptionalUser(request);
  return data(
    { user: result.user },
    result.setCookie ? { headers: { "Set-Cookie": result.setCookie } } : {},
  );
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar user={user} />
      <Outlet />
      <Footer />
    </>
  );
}
