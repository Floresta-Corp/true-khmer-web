import { Outlet, useLoaderData } from "react-router";
import { Navbar } from "~/components/navbar";
import { getUser } from "~/lib/session.server";
import type { Route } from "./+types/app-layout";
import { Footer } from "~/components/footer";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
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
