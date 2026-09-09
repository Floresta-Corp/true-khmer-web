import { getPublicPartners } from "~/api/partner/partner-directory.server";
import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { anonymousRequest } from "../lib/anonymous-request";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

/**
 * `GET /sitemap-community.xml`.
 *
 * The partner directory is a single unpaginated read, so there is nothing to
 * walk. A failure yields the hub page on its own rather than a 500: Search
 * Console treats a fetch error on a listed sitemap as a site-level problem,
 * where a thin file is just a thin file.
 */
export async function sitemapCommunityLoader({
  request,
}: {
  request: Request;
}) {
  const origin = resolveSiteOrigin(request);

  const entries: SitemapEntry[] = [
    { path: "/community", changefreq: "weekly", priority: 0.8 },
  ];

  try {
    const result = await getPublicPartners(anonymousRequest(request));

    for (const partner of result.data.data) {
      entries.push({
        path: `/community/partner/${partner.id}`,
        lastmod: partner.createdAt,
        changefreq: "monthly",
        priority: 0.6,
      });
    }
  } catch (error) {
    console.warn("[sitemap] community partners failed:", error);
  }

  return xmlResponse(renderUrlset(origin, entries));
}
