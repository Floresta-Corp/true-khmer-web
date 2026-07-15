import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.$postId.edit";
import {
  getModeratorBlogCategories,
  getModeratorBlogPost,
} from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

export async function blogEditLoader({ request, params }: Route.LoaderArgs) {
  const { setCookie } = await requireAdmin(request);
  const postId = params.postId;
  if (!postId) {
    throw new Response("Blog post ID is required", { status: 400 });
  }

  try {
    const [postResult, categoriesResult] = await Promise.all([
      getModeratorBlogPost(request, postId),
      getModeratorBlogCategories(request),
    ]);

    return data(
      {
        post: postResult.data.post,
        categories: categoriesResult.data.categories,
      },
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 404) {
      throw new Response("Blog post not found", { status: 404 });
    }
    if (err instanceof ProtectedApiError && err.status === 403) {
      throw new Response("You cannot edit this blog post", { status: 403 });
    }
    throw err;
  }
}
