import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
} from "~/lib/server/api-client.server";
import type {
  CreateBlogCommentRequest,
  CreateBlogCommentResponse,
  DeleteBlogCommentResponse,
  EditBlogCommentResponse,
  GetBlogCommentsResponse,
  UpdateBlogCommentRequest,
} from "~/types/api-client";
import type { BlogCommentSort } from "~/features/blog/types";

// GET /v1/blog/comment
export async function getBlogComments(
  request: Request,
  postId: string,
  sortBy: BlogCommentSort = "newest",
) {
  const query = new URLSearchParams({ postId, sortBy });

  return apiRequestWithOptionalSession<GetBlogCommentsResponse>(
    request,
    `/blog/comment?${query.toString()}`,
    { method: "GET" },
  );
}

// POST /v1/blog/comment
export async function createBlogComment(
  request: Request,
  body: CreateBlogCommentRequest,
) {
  return apiRequestWithSession<
    CreateBlogCommentResponse,
    CreateBlogCommentRequest
  >(request, "/blog/comment", { method: "POST", body });
}

// PATCH /v1/blog/comment/{commentId}
export async function updateBlogComment(
  request: Request,
  commentId: string,
  body: UpdateBlogCommentRequest,
) {
  return apiRequestWithSession<
    EditBlogCommentResponse,
    UpdateBlogCommentRequest
  >(request, `/blog/comment/${encodeURIComponent(commentId)}`, {
    method: "PATCH",
    body,
  });
}

// DELETE /v1/blog/comment/{commentId}
export async function deleteBlogComment(request: Request, commentId: string) {
  return apiRequestWithSession<DeleteBlogCommentResponse>(
    request,
    `/blog/comment/${encodeURIComponent(commentId)}`,
    { method: "DELETE" },
  );
}
