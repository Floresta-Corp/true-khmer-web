import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { SITEMAP_PATHS } from "~/lib/seo/robots-policy";
import { renderSitemapIndex, xmlResponse } from "../lib/xml";

/**
 * `GET /sitemap.xml` — the index the other sitemaps hang off.
 *
 * Split by section rather than served as one file so that a single failing
 * upstream (Plumpi for events, the courses service) costs us that section's
 * URLs instead of the whole sitemap, and so no one file approaches the
 * 50,000-URL limit as the platform grows.
 */
export function sitemapIndexLoader({ request }: { request: Request }) {
  const origin = resolveSiteOrigin(request);
  return xmlResponse(renderSitemapIndex(origin, SITEMAP_PATHS));
}
