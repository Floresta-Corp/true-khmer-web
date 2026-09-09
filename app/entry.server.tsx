import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isIndexableOrigin, resolveSiteOrigin } from "~/lib/seo/origin.server";
import { isPrivatePath } from "~/lib/seo/robots-policy";

/**
 * Stamp `X-Robots-Tag` on the responses that must stay out of the index.
 *
 * Done here rather than route by route for two reasons. First, coverage: there
 * are over a hundred route modules and a new private screen would otherwise
 * ship indexable by default -- the safe default belongs in one place. Second,
 * `robots.txt` alone is not enough: a disallowed URL can still be indexed from
 * inbound links, and because it is never fetched a `<meta robots>` tag on it
 * would never be read. The header is what actually removes a page, and a
 * non-production deployment gets it on everything so a staging copy can never
 * outrank the real site.
 */
function applyRobotsHeader(request: Request, headers: Headers) {
  if (headers.has("X-Robots-Tag")) return;

  const origin = resolveSiteOrigin(request);
  const { pathname } = new URL(request.url);

  if (!isIndexableOrigin(origin) || isPrivatePath(pathname)) {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }
}

// React Router's default server entry renders with `renderToPipeableStream`,
// which only exists in React's Node build -- on Workers it is undefined and
// every document request fails with "renderToPipeableStream is not a function".
// `renderToReadableStream` is the web-stream equivalent and is present in both
// React's Node and workerd builds, so this one entry serves both deploy
// targets.
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  let shellRendered = false;
  const userAgent = request.headers.get("user-agent");

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500;
        // Errors thrown while rendering the shell reject the promise above and
        // are reported by React Router itself; only the ones that surface after
        // the shell has flushed need logging here.
        if (shellRendered) {
          console.error(error);
        }
      },
    },
  );
  shellRendered = true;

  // Bots and SPA Mode renders need the whole document, not a streamed shell.
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  applyRobotsHeader(request, responseHeaders);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
