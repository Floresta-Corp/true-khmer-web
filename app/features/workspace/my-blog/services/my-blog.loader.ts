import { z } from "zod";
import type { Route } from "project-types/workspace/my-blog/route/+types/my-blog";
import { getPublicBlogCategories } from "~/api/blog/blog-public.server";
import { getMyBlogPosts } from "~/api/blog/blog-post.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { MY_BLOG_PAGE_SIZE } from "../types";

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  search: z.string().optional(),
  status: z
    .enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "UNPUBLISHED"])
    .optional(),
});

export async function myBlogLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const url = new URL(request.url);
  const filters = querySchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );

  const content = Promise.all([
    getMyBlogPosts(request, {
      page: filters.page,
      pageSize: MY_BLOG_PAGE_SIZE,
      search: filters.search,
      status: filters.status,
      sortField: "updatedAt",
      sortOrder: "desc",
    }),
    getPublicBlogCategories(request),
  ]).then(([postsResult, categoriesResult]) => ({
    posts: postsResult.data.data,
    meta: postsResult.data.meta,
    categories: categoriesResult.data.categories,
  }));

  return withAuthData(auth, { content, filters });
}
