import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.new";
import { getModeratorBlogCategories } from "~/api/admin/blog/blog.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

export async function blogNewLoader({ request }: Route.LoaderArgs) {
  const { setCookie } = await requireAdmin(request);
  const categoriesResult = await getModeratorBlogCategories(request);

  return data(
    { categories: categoriesResult.data.categories },
    setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
  );
}
