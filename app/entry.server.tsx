import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

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
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
