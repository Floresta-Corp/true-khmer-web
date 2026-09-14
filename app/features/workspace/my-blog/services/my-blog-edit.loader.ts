import type { Route } from "project-types/workspace/my-blog/route/+types/my-blog.$postId.edit";
import { getPublicBlogCategories } from "~/api/blog/blog-public.server";
import { getMyBlogPost } from "~/api/blog/blog-post.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { toBlogViewer } from "../lib/blog-viewer";

export async function myBlogEditLoader({ request, params }: Route.LoaderArgs) {
  const auth = await requireUser(request);
  const postId = params.postId;
  if (!postId) {
    throw new Response("Blog post ID is required", { status: 400 });
  }

  try {
    const [postResult, categoriesResult] = await Promise.all([
      getMyBlogPost(request, postId),
      getPublicBlogCategories(request),
    ]);

    return withAuthData(auth, {
      post: postResult.data.post,
      categories: categoriesResult.data.categories,
      viewer: toBlogViewer(auth.user),
    });
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Blog post not found", { status: 404 });
    }
    throw error;
  }
}
