import { z } from "zod";
import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.categories";
import { getModeratorBlogCategories } from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

const querySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
});

export async function blogCategoriesLoader({ request }: Route.LoaderArgs) {
  const { setCookie } = await requireAdmin(request);
  const url = new URL(request.url);
  const filters = querySchema.parse(
    Object.fromEntries(url.searchParams.entries()),
  );
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  const content = getModeratorBlogCategories(request, filters.search).then(
    (result) => result.data.categories,
  );

  return data({ content, filters }, cookieHeader);
}
