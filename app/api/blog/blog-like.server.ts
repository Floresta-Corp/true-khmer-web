import { apiRequestWithSession } from "~/lib/server/api-client.server";

// Not in the generated client yet (`api-client.ts` is built from staging).
export interface BlogPostLikeResponse {
  ok: true;
  liked: boolean;
  likeCount: number;
}

// PUT /v1/blog/posts/{id}/like · DELETE /v1/blog/posts/{id}/like
export async function setBlogPostLike(
  request: Request,
  postId: string,
  liked: boolean,
) {
  return apiRequestWithSession<BlogPostLikeResponse>(
    request,
    `/blog/posts/${encodeURIComponent(postId)}/like`,
    { method: liked ? "PUT" : "DELETE" },
  );
}
