import { z } from "zod";
import { data } from "react-router";
import type { Route } from "project-types/blog/route/+types/blog";
import {
  getPublicBlogCategories,
  getPublicBlogPosts,
} from "~/api/blog/blog-public.server";

const BLOGS_PAGE_SIZE = 6;

const querySchema = z.object({
  sort: z.enum(["newest", "oldest"]).optional().default("newest"),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
});

export function headers() {
  return {
    "Cache-Control":
      "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
  };
}

export async function blogLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = querySchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );

  const [categoriesResult, listingResult] = await Promise.all([
    getPublicBlogCategories(request),
    getPublicBlogPosts(request, {
      page: 1,
      pageSize: query.page * BLOGS_PAGE_SIZE,
      categorySlug: query.category,
      sort: query.sort,
    }),
  ]);

  const categories = categoriesResult.data.categories;
  const activeCategory = query.category
    ? (categories.find((category) => category.slug === query.category) ?? null)
    : null;

  return data({
    categories,
    activeCategory,
    featuredPost: listingResult.data.featuredPost,
    posts: listingResult.data.data,
    sort: query.sort,
    page: query.page,
    hasMore: listingResult.data.meta.total > query.page * BLOGS_PAGE_SIZE,
  });
}
