import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.$postId";
import { getModeratorBlogPost } from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

export async function blogDetailLoader({ request, params }: Route.LoaderArgs) {
  const { admin, setCookie } = await requireAdmin(request);
  const postId = params.postId;
  if (!postId) {
    throw new Response("Blog post ID is required", { status: 400 });
  }

  try {
    const result = await getModeratorBlogPost(request, postId);
    return data(
      {
        post: result.data.post,
        canManage: result.data.post.createdBy === admin.id,
      },
      setCookie ? { headers: { "Set-Cookie": setCookie } } : {},
    );
  } catch (err) {
    if (err instanceof ProtectedApiError && err.status === 404) {
      throw new Response("Blog post not found", { status: 404 });
    }
    throw err;
  }
}
