import { getServerEnv } from "~/lib/server/env";

/**
 * Fill in a missing scheme, the same way `resolveApiBase` does for the API
 * base: `truekhmer.com` is not something `new URL` can parse, and the failure
 * would surface as a blank canonical rather than a named misconfiguration.
 */
function withScheme(value: string) {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return value;

  const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(value);
  return `${isLoopback ? "http" : "https"}://${value}`;
}

/**
 * The one origin every canonical URL, `og:url` and sitemap entry is written
 * against.
 *
 * `SITE_URL` wins, because a site reachable on more than one hostname (the
 * Workers preview domain, `www.` and the apex, a tunnel) must still publish a
 * single canonical host — otherwise search engines split the same page into
 * several competing URLs and neither ranks. With no override the served origin
 * is used, which is right for local development and harmless anywhere the
 * hostname is already the canonical one.
 */
export function resolveSiteOrigin(request: Request): string {
  const configured = getServerEnv("SITE_URL")?.trim();

  if (configured) {
    try {
      return new URL(withScheme(configured)).origin;
    } catch {
      // Name the variable at fault rather than emitting a broken canonical that
      // would quietly de-index the site.
      console.warn(
        `[seo] SITE_URL is not a usable URL (${JSON.stringify(configured)}); falling back to the request origin`,
      );
    }
  }

  return new URL(request.url).origin;
}

/** Hosts that are never the live site, however they are reached. */
const NON_PRODUCTION_HOST =
  /(^|\.)(localhost|workers\.dev|pages\.dev|devtunnels\.ms|vercel\.app|ngrok(-free)?\.app|ngrok\.io)$/i;
const NON_PRODUCTION_LABEL =
  /(^|[.-])(stage|staging|preview|test|qa|dev)([.-]|$)/i;

/**
 * Whether this deployment may be indexed at all.
 *
 * A staging copy that ranks for the brand is worse than one that does not
 * exist: it splits link equity and serves half-finished content to searchers.
 * `SEO_INDEXABLE` is the explicit switch; without it the host decides, and
 * anything that looks like a preview or a local run is held back. Getting this
 * wrong in the safe direction costs nothing, so the default is cautious.
 */
export function isIndexableOrigin(origin: string): boolean {
  const configured = getServerEnv("SEO_INDEXABLE")?.trim().toLowerCase();
  if (configured === "true" || configured === "1") return true;
  if (configured === "false" || configured === "0") return false;

  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }

  if (host === "127.0.0.1" || host === "::1") return false;

  return !NON_PRODUCTION_HOST.test(host) && !NON_PRODUCTION_LABEL.test(host);
}
