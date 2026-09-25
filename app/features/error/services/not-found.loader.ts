import { data, redirect, type LoaderFunctionArgs } from "react-router";
import { resolveLegacyManagePostRoute } from "~/lib/redirects";

/* The catch-all route renders its page, so the status has to be set here —
   otherwise an unmatched URL answers 200 and search engines index it. */
export function notFoundLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Links sent before `/workspace/manage-post` was split still arrive, in
  // several malformed shapes — recover them instead of showing the 404.
  const legacy = resolveLegacyManagePostRoute(url.pathname);
  if (legacy) throw redirect(`${legacy}${url.search}`);

  return data(null, { status: 404 });
}
