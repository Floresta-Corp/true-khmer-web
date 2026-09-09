import { getPlumpiEvents } from "~/api/events/events.server";
import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { anonymousRequest } from "../lib/anonymous-request";
import { collectPaged } from "../lib/collect";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

const PAGE_SIZE = 100;

type EventRow = { slug?: unknown; updatedAt?: unknown; startAt?: unknown };

/**
 * `GET /sitemap-events.xml`.
 *
 * Only published, publicly listed events, and only ones that have not started:
 * a finished event's page is still reachable but is not something to keep
 * pushing crawlers at. Rows come from Plumpi typed as open records, so the two
 * fields needed are read defensively and an unusable row is skipped rather than
 * emitted as a broken `<loc>`.
 */
export async function sitemapEventsLoader({ request }: { request: Request }) {
  const origin = resolveSiteOrigin(request);
  const anonymous = anonymousRequest(request);
  const startDate = new Date().toISOString();

  const events = await collectPaged("events", async (page) => {
    const result = await getPlumpiEvents(anonymous, {
      page,
      limit: PAGE_SIZE,
      status: "PUBLISHED",
      visibility: "LISTED",
      startDate,
      sortBy: "startAt",
      sortOrder: "asc",
    });

    const items = (result.data.events ?? []) as EventRow[];
    return { items, hasMore: items.length === PAGE_SIZE };
  });

  const entries: SitemapEntry[] = [
    { path: "/events", changefreq: "daily", priority: 0.9 },
    ...events.flatMap((event): SitemapEntry[] => {
      if (typeof event.slug !== "string" || !event.slug) return [];

      return [
        {
          path: `/events/detail/${event.slug}`,
          lastmod: typeof event.updatedAt === "string" ? event.updatedAt : null,
          changefreq: "daily",
          priority: 0.7,
        },
      ];
    }),
  ];

  return xmlResponse(renderUrlset(origin, entries));
}
