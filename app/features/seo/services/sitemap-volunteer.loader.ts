import { getPublicVolunteerOpportunities } from "~/api/volunteer/volunteer.opportunities.server";
import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { anonymousRequest } from "../lib/anonymous-request";
import { collectCursored } from "../lib/collect";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

const PAGE_SIZE = 100;

/**
 * `GET /sitemap-volunteer.xml`.
 *
 * An opportunity whose deadline has passed keeps its page but drops out of the
 * sitemap: the listing is a live call for applicants, and a crawler's budget is
 * better spent on the ones still open.
 */
export async function sitemapVolunteerLoader({
  request,
}: {
  request: Request;
}) {
  const origin = resolveSiteOrigin(request);
  const anonymous = anonymousRequest(request);

  const opportunities = await collectCursored("volunteer", async (cursor) => {
    const result = await getPublicVolunteerOpportunities(anonymous, {
      limit: PAGE_SIZE,
      ...(cursor ? { cursor } : {}),
    });

    if (!result) return null;

    return {
      items: result.data.opportunities,
      nextCursor: result.data.pagination.nextCursor,
    };
  });

  const now = Date.now();
  const entries: SitemapEntry[] = [
    { path: "/volunteer", changefreq: "daily", priority: 0.9 },
    ...opportunities.flatMap((opportunity): SitemapEntry[] => {
      const deadline = Date.parse(opportunity.applicationDeadline);
      if (Number.isFinite(deadline) && deadline < now) return [];

      return [
        {
          path: `/volunteer/detail/${opportunity.id}`,
          lastmod: opportunity.createdAt,
          changefreq: "weekly",
          priority: 0.7,
        },
      ];
    }),
  ];

  return xmlResponse(renderUrlset(origin, entries));
}
