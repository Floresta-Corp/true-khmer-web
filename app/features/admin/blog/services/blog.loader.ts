import { z } from "zod";
import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog";
import {
  getModeratorBlogCategories,
  getModeratorBlogPosts,
} from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  placement: z.enum(["HOME", "CONTACT", "NONE"]).optional(),
});

export async function blogLoader({ request }: Route.LoaderArgs) {
  const { admin, setCookie } = await requireAdmin(request);
  const url = new URL(request.url);
  const query = querySchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  const content = Promise.all([
    getModeratorBlogPosts(request, {
      page: query.page,
      pageSize: 12,
      search: query.search,
      status: query.status,
      placement: query.placement,
      sortField: "updatedAt",
      sortOrder: "desc",
    }),
    getModeratorBlogCategories(request),
  ]).then(([postsResult, categoriesResult]) => ({
    posts: postsResult.data.data,
    meta: postsResult.data.meta,
    categories: categoriesResult.data.categories,
  }));

  return data(
    {
      content,
      currentUserId: admin?.id ?? "",
      filters: query,
    },
    cookieHeader,
  );
}
