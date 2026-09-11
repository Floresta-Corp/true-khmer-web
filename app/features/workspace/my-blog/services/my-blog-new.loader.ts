import type { Route } from "project-types/workspace/my-blog/route/+types/my-blog.new";
import { getPublicBlogCategories } from "~/api/blog/blog-public.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { toBlogViewer } from "../lib/blog-viewer";

export async function myBlogNewLoader({ request }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const categoriesResult = await getPublicBlogCategories(request);

  return withAuthData(auth, {
    categories: categoriesResult.data.categories,
    viewer: toBlogViewer(auth.user),
  });
}
