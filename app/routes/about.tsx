import { useLoaderData } from "react-router";
import type { Route } from "./+types/about";
import { getUser } from "~/lib/session.server";
import { Navbar } from "~/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function meta() {
  return [
    { title: "About | True Khmer" },
    { name: "description", content: "Learn more about True Khmer" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

// +types/logout.ts
export type LoaderArgs = {
  request: Request;
};

export type Route = {
  LoaderArgs: LoaderArgs;
};

export default function AboutPage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
          About True Khmer
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          A full-stack sample application built with React Router v7.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is this?</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                This project demonstrates how to build a full-stack application
                with authentication, protected routes, public pages, and API
                endpoints — all in a single codebase.
              </p>
              <p>
                It uses{" "}
                <strong className="text-foreground">React Router v7</strong>{" "}
                (the successor to Remix), cookie-based sessions, and{" "}
                <strong className="text-foreground">shadcn/ui</strong> for the
                component library.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public vs Protected Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Page
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Access
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        How
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 font-mono text-foreground">/</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                          Public
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Uses <code className="text-foreground">getUser()</code>{" "}
                        — optional
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-foreground">
                        /about
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                          Public
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Uses <code className="text-foreground">getUser()</code>{" "}
                        — optional
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-foreground">
                        /dashboard
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                          Protected
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Uses{" "}
                        <code className="text-foreground">requireUser()</code> —
                        redirects to /login
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-foreground">
                        /api/me
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                          Semi
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Returns 401 JSON if not logged in
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}