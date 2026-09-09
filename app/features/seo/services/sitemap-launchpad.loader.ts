import { GetLaunchpadProjectsPaginated } from "~/api/launchpad/launchpad.server";
import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { anonymousRequest } from "../lib/anonymous-request";
import { collectCursored } from "../lib/collect";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

const PAGE_SIZE = 100;

/**
 * `GET /sitemap-launchpad.xml`.
 *
 * Like volunteer opportunities, a project past its deadline is left out — the
 * page stays live for anyone holding the link, but it is no longer something to
 * send crawlers back to.
 */
export async function sitemapLaunchpadLoader({
  request,
}: {
  request: Request;
}) {
  const origin = resolveSiteOrigin(request);
  const anonymous = anonymousRequest(request);

  const projects = await collectCursored("launchpad", async (cursor) => {
    const result = await GetLaunchpadProjectsPaginated(anonymous, {
      limit: PAGE_SIZE,
      cursor,
      sortBy: "newest",
    });

    return { items: result.launchpads, nextCursor: result.nextCursor };
  });

  const now = Date.now();
  const entries: SitemapEntry[] = [
    { path: "/launchpad", changefreq: "daily", priority: 0.9 },
    ...projects.flatMap((project): SitemapEntry[] => {
      const deadline = Date.parse(project.deadline);
      if (Number.isFinite(deadline) && deadline < now) return [];

      return [
        {
          path: `/launchpad/detail/${project.id}`,
          lastmod: project.createdAt,
          changefreq: "weekly",
          priority: 0.7,
        },
      ];
    }),
  ];

  return xmlResponse(renderUrlset(origin, entries));
}
