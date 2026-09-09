import { z } from "zod";
import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog";
import {
  getModeratorBlogCategories,
  getModeratorBlogPosts,
} from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { BLOG_QUEUE_PAGE_SIZE } from "../types";

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  search: z.string().optional(),
  status: z
    .enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED", "UNPUBLISHED"])
    .optional(),
});

export async function blogLoader({ request }: Route.LoaderArgs) {
  // Admin sessions are MODERATOR or SUPER_ADMIN — the moderation queue's
  // minimum role.
  const { setCookie } = await requireAdmin(request);
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
      pageSize: BLOG_QUEUE_PAGE_SIZE,
      search: query.search,
      status: query.status,
      sortField: "updatedAt",
      sortOrder: "desc",
    }),
    getModeratorBlogCategories(request),
  ]).then(([postsResult, categoriesResult]) => ({
    posts: postsResult.data.data,
    meta: postsResult.data.meta,
    categories: categoriesResult.data.categories,
  }));

  return data({ content, filters: query }, cookieHeader);
}
