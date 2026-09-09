import { getPublicBlogPosts } from "~/api/blog/blog-public.server";
import { resolveSiteOrigin } from "~/lib/seo/origin.server";
import { anonymousRequest } from "../lib/anonymous-request";
import { collectPaged } from "../lib/collect";
import { renderUrlset, xmlResponse, type SitemapEntry } from "../lib/xml";

/** `GET /v1/blog/public/posts` rejects a `pageSize` above 50. */
const PAGE_SIZE = 50;

/**
 * `GET /sitemap-blog.xml`.
 *
 * `lastmod` comes from the post's own `updatedAt`, which is the one timestamp
 * here that genuinely tracks the content — that is what tells a crawler an
 * already-indexed article is worth re-reading.
 */
export async function sitemapBlogLoader({ request }: { request: Request }) {
  const origin = resolveSiteOrigin(request);
  const anonymous = anonymousRequest(request);

  const posts = await collectPaged("blog", async (page) => {
    const result = await getPublicBlogPosts(anonymous, {
      page,
      pageSize: PAGE_SIZE,
      sort: "newest",
    });

    const items = result.data.data;
    const meta = result.data.meta as { totalPages?: number } | undefined;

    return {
      items,
      hasMore: meta?.totalPages
        ? page < meta.totalPages
        : items.length === PAGE_SIZE,
    };
  });

  const entries: SitemapEntry[] = [
    { path: "/blog", changefreq: "daily", priority: 0.9 },
    ...posts.map(
      (post): SitemapEntry => ({
        path: `/blog/${post.slug}`,
        lastmod: post.updatedAt ?? post.publishedAt,
        changefreq: "weekly",
        priority: post.isFeatured ? 0.8 : 0.7,
      }),
    ),
  ];

  return xmlResponse(renderUrlset(origin, entries));
}
