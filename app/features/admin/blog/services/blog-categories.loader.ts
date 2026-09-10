import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.categories";
import { getModeratorBlogCategories } from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

export async function blogCategoriesLoader({ request }: Route.LoaderArgs) {
  const { setCookie } = await requireAdmin(request);
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  const content = getModeratorBlogCategories(request).then(
    (result) => result.data.categories,
  );

  return data({ content }, cookieHeader);
}
