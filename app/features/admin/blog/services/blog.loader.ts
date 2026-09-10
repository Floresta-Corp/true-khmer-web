import { z } from "zod";
import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog";
import { getModeratorBlogPosts } from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { BLOG_LIBRARY_STATUSES, BLOG_QUEUE_PAGE_SIZE } from "../types";

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  search: z.string().optional(),
  // Pending submissions are handled on /tk-admin/khmer-voices/review, so this page only
  // filters across statuses a post reaches after review.
  status: z.enum(BLOG_LIBRARY_STATUSES).optional().default("PUBLISHED"),
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

  const content = getModeratorBlogPosts(request, {
    page: query.page,
    pageSize: BLOG_QUEUE_PAGE_SIZE,
    search: query.search,
    status: query.status,
    sortField: "updatedAt",
    sortOrder: "desc",
  }).then((postsResult) => ({
    posts: postsResult.data.data,
    meta: postsResult.data.meta,
    // statusCounts is computed before the status filter is applied, so the
    // "action required" banner stays accurate while viewing published blogs.
    pendingCount: postsResult.data.meta.statusCounts.PENDING_REVIEW,
  }));

  return data({ content, filters: query }, cookieHeader);
}
