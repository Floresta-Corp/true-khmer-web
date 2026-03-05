import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";
import { getUser } from "~/lib/session.server";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "True Khmer" },
    { name: "description", content: "Welcome to True Khmer!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

export default function Home() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <main className="flex flex-col items-center justify-center px-4 py-24 sm:py-32">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
          True Khmer
        </h1>
        <p className="text-lg text-muted-foreground mb-10 text-center max-w-md">
          A full-stack app built with React Router v7, cookie sessions &amp;
          shadcn/ui.
        </p>

        {user ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              Logged in as{" "}
              <strong className="text-foreground">{user.email}</strong>
            </p>
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
