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
import { getScrollRestorationKey } from "./lib/scroll-restoration";
import { pageMeta, SITE } from "./lib/seo";
import { isIndexableOrigin, resolveSiteOrigin } from "./lib/seo/origin.server";

/**
 * Publishes the SEO context every route's `meta` reads back out of `matches`.
 *
 * It lives on the root rather than in each `meta` because a `meta` function is
 * given only a pathname, and also runs in the browser -- neither the canonical
 * host nor the "is this deployment indexable" decision is knowable there.
 */
export function loader({ request }: Route.LoaderArgs) {
  const origin = resolveSiteOrigin(request);
  return { seo: { origin, indexable: isIndexableOrigin(origin) } };
}

/** The origin cannot change between navigations, so root never refetches. */
export function shouldRevalidate() {
  return false;
}

/**
 * The fallback tag set, used by any route that does not export its own `meta`.
 *
 * React Router replaces rather than merges parent meta, so this is a safety net
 * for un-tagged routes, not a base layer -- a route that needs its own title
 * builds the whole set through `buildSeoMeta`.
 */
export function meta(args: Route.MetaArgs) {
  return pageMeta(args, {
    title: `${SITE.name} — ${SITE.tagline}`,
    bareTitle: true,
    description: SITE.description,
  });
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
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
        <ScrollRestoration getKey={getScrollRestorationKey} />
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
