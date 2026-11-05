import { data, redirect } from "react-router";
import type { Route } from "project-types/blog/route/+types/blog.$slug";
import { getPublicBlogPostBySlug } from "~/api/blog/blog-public.server";
import { getBlogComments } from "~/api/blog/blog-comment.server";
import {
  ProtectedApiError,
  readOptional,
} from "~/lib/server/api-client.server";
import { requestWithSetCookie } from "~/lib/server/route-guards.server";
import { getUser } from "~/lib/server/session.server";
import { parseBlogCommentSort, type BlogCommentViewer } from "../types";

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  const responseHeaders = new Headers({
    // The document response includes app-layout's SSR'd navbar, which is
    // per-user. A shared cache (Vercel's CDN) keys on URL only, so any
    // `public`/`s-maxage` value here serves one visitor's account to everyone.
    "Cache-Control": "private, no-cache, no-store, must-revalidate",
  });

  for (const cookie of loaderHeaders.getSetCookie()) {
    responseHeaders.append("Set-Cookie", cookie);
  }

  return responseHeaders;
}

function toCommentViewer(
  user: Awaited<ReturnType<typeof getUser>>,
): BlogCommentViewer | null {
  if (!user) return null;

  const avatarKey =
    ("profile" in user ? user.profile?.avatarKey : null) ?? user.image ?? null;

  return { id: user.id, name: user.name, avatarKey };
}

export async function blogDetailLoader({ request, params }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw redirect("/khmer-voices");
  }

  const commentSort = parseBlogCommentSort(
    new URL(request.url).searchParams.get("sortBy"),
  );

  try {
    const result = await getPublicBlogPostBySlug(request, slug);
    // If the post read refreshed the session, the next read must use the new
    // tokens: replaying the rotated refresh token would sign the viewer out.
    const sessionRequest = requestWithSetCookie(request, result.setCookie);
    const [user, commentsResult] = await Promise.all([
      getUser(sessionRequest),
      readOptional("blog comments", () =>
        getBlogComments(sessionRequest, result.data.post.id, commentSort),
      ),
    ]);
    const setCookie = commentsResult?.setCookie ?? result.setCookie;

    return data(
      {
        post: result.data.post,
        relatedPosts: result.data.relatedPosts,
        comments: commentsResult?.data.comments ?? [],
        commentTotal: commentsResult?.data.total ?? 0,
        commentSort,
        viewer: toCommentViewer(user),
      },
      setCookie ? { headers: { "Set-Cookie": setCookie } } : undefined,
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw redirect("/khmer-voices");
    }
    throw error;
  }
}
