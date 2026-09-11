import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

/**
 * The site's fixed public pages.
 *
 * `priority` is a hint about relative importance within this site, not a
 * ranking lever, so it is set from how central a page is to the platform: the
 * home page, then the section hubs, then the pages a visitor reaches from them.
 * No `lastmod` -- these are code, not records, and a timestamp that moved on
 * every deploy would be noise.
 */
const STATIC_ENTRIES: readonly SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.7 },
  { path: "/blog", changefreq: "daily", priority: 0.9 },
  { path: "/community", changefreq: "weekly", priority: 0.8 },
  { path: "/education", changefreq: "daily", priority: 0.9 },
  { path: "/education/all", changefreq: "daily", priority: 0.7 },
  { path: "/events", changefreq: "daily", priority: 0.9 },
  { path: "/events/all", changefreq: "daily", priority: 0.7 },
  { path: "/forum", changefreq: "hourly", priority: 0.9 },
  { path: "/launchpad", changefreq: "daily", priority: 0.9 },
  { path: "/launchpad/all", changefreq: "daily", priority: 0.7 },
  { path: "/poc", changefreq: "weekly", priority: 0.7 },
  { path: "/volunteer", changefreq: "daily", priority: 0.9 },
  { path: "/volunteer/all", changefreq: "daily", priority: 0.7 },
  /* The legal pages change rarely but are expected to be findable: a searcher
     looking for the terms they agreed to should not have to hunt the footer. */
  { path: "/privacy", changefreq: "yearly", priority: 0.4 },
  { path: "/terms", changefreq: "yearly", priority: 0.4 },
  { path: "/cookies", changefreq: "yearly", priority: 0.3 },
  /* `/registration` itself only redirects here, and a sitemap entry that
     answers with a 302 is reported as a soft error. */
  {
    path: "/registration/partner-registration",
    changefreq: "monthly",
    priority: 0.6,
  },
];

export function sitemapPagesLoader({ request }: { request: Request }) {
  const origin = resolveSiteOrigin(request);
  return xmlResponse(renderUrlset(origin, STATIC_ENTRIES));
}
