import { listPublicCourses } from "~/api/education/education.server";
import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { anonymousRequest } from "../lib/anonymous-request";
import { collectPaged } from "../lib/collect";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

/** `GET /v1/education-center/courses` rejects a `limit` above 50. */
const PAGE_SIZE = 50;

/** `GET /sitemap-education.xml` — the published course catalogue. */
export async function sitemapEducationLoader({
  request,
}: {
  request: Request;
}) {
  const origin = resolveSiteOrigin(request);
  const anonymous = anonymousRequest(request);

  const courses = await collectPaged("education", async (page) => {
    const result = await listPublicCourses(anonymous, {
      page,
      limit: PAGE_SIZE,
      sortBy: "newest",
    });

    if (!result) return null;

    const { courses: items, pagination } = result.data;
    return { items, hasMore: page < pagination.totalPages };
  });

  const entries: SitemapEntry[] = [
    { path: "/education", changefreq: "daily", priority: 0.9 },
    ...courses.map(
      (course): SitemapEntry => ({
        path: `/education/${course.id}`,
        lastmod: course.publishedAt ?? course.createdAt,
        changefreq: "weekly",
        priority: 0.7,
      }),
    ),
  ];

  return xmlResponse(renderUrlset(origin, entries));
}
