import { data, redirect } from "react-router";
import type { Route } from "project-types/blog/route/+types/blog.$slug";
import { getPublicBlogPostBySlug } from "~/api/blog/blog-public.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";

export function headers() {
  return {
    // The document response includes app-layout's SSR'd navbar, which is
    // per-user. A shared cache (Vercel's CDN) keys on URL only, so any
    // `public`/`s-maxage` value here serves one visitor's account to everyone.
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
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
