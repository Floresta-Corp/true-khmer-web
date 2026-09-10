import { z } from "zod";
import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.review";
import { getModeratorBlogPosts } from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { BLOG_QUEUE_PAGE_SIZE } from "../types";

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  search: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export async function blogReviewLoader({ request }: Route.LoaderArgs) {
  const { setCookie } = await requireAdmin(request);
  const url = new URL(request.url);
  const query = querySchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  // This queue is pinned to PENDING_REVIEW — there is no status filter here.
  const content = getModeratorBlogPosts(request, {
    page: query.page,
    pageSize: BLOG_QUEUE_PAGE_SIZE,
    search: query.search,
    status: "PENDING_REVIEW",
    sortField: "submittedAt",
    sortOrder: query.sortOrder,
  }).then((postsResult) => ({
    posts: postsResult.data.data,
    meta: postsResult.data.meta,
  }));

  return data({ content, filters: query }, cookieHeader);
}
