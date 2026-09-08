import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Toaster } from "./components/ui/sonner";
import { ErrorState } from "./features/error/components/error-state";
import { NotFound } from "./features/error/components/not-found";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors theme="light" position="top-right" closeButton />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  const isRouteError = isRouteErrorResponse(error);
  const code = isRouteError ? `Error ${error.status}` : "Error";
  const detail = isRouteError ? error.statusText || undefined : undefined;
  const stack =
    import.meta.env.DEV && error instanceof Error ? error.stack : undefined;

  return (
    <ErrorState
      code={code}
      heading="It looks like something went wrong."
      lines={[
        detail ?? "Don't worry, our team is already on it.",
        "Please try refreshing the page or come back later.",
      ]}
    >
      {stack && (
        <pre className="mt-8 w-full overflow-x-auto rounded-xl bg-[#f4f6f9] p-4 text-left text-xs text-[#606060]">
          <code>{stack}</code>
        </pre>
      )}
    </ErrorState>
  );
}
