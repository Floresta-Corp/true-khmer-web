import { data, redirect } from "react-router";
import type { Route } from "project-types/blog/route/+types/blog.$slug";
import { getPublicBlogPostBySlug } from "~/api/blog/blog-public.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export function headers() {
  return {
    "Cache-Control":
      "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
  };
}

export async function blogDetailLoader({ request, params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw redirect("/blog");
  }

  try {
    const result = await getPublicBlogPostBySlug(request, slug);
    return data({
      post: result.data.post,
      relatedPosts: result.data.relatedPosts,
    });
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw redirect("/blog");
    }
    throw error;
  }
}
