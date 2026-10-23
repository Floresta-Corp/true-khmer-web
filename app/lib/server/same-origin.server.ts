/**
 * Whether a form POST came from one of our own pages, so another site can't
 * submit a public form through a visitor's browser.
 *
 * Browsers send `Sec-Fetch-Site` on every request; `Origin` covers older ones.
 * Only the host is compared, since behind a TLS-terminating proxy the request
 * URL can say `http:` while the page was `https:`. A request with neither
 * header didn't come from a browser page, so there is nothing to forge.
 */
export function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";

  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const host = request.headers.get("host") ?? new URL(request.url).host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
