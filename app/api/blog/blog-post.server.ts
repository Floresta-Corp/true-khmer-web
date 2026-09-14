import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  CreateBlogPostRequest,
  CreateBlogPostResponse,
  DeleteBlogPostResponse,
  GetBlogPostResponse,
  ListMyBlogPostsResponse,
  PresignBlogImageUploadRequest,
  PresignBlogImageUploadResponse,
  UnpublishMyBlogPostRequest,
  UpdateBlogPostRequest,
  UpdateBlogPostResponse,
} from "~/types/api-client";
import type {
  MyBlogPostStatus,
  MyBlogSortField,
} from "~/features/workspace/my-blog/types";

export interface ListMyBlogPostsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: MyBlogPostStatus;
  sortField?: MyBlogSortField;
  sortOrder?: "asc" | "desc";
}

// GET /v1/blog/posts
export async function getMyBlogPosts(
  request: Request,
  query: ListMyBlogPostsQuery,
) {
  const searchParams = new URLSearchParams();
  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.pageSize !== undefined)
    searchParams.set("pageSize", String(query.pageSize));
  if (query.search) searchParams.set("search", query.search);
  if (query.status) searchParams.set("status", query.status);
  if (query.sortField) searchParams.set("sortField", query.sortField);
  if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);

  const queryString = searchParams.toString();

  return apiRequestWithSession<ListMyBlogPostsResponse>(
    request,
    `/blog/posts${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
}

// GET /v1/blog/posts/{id}
export async function getMyBlogPost(request: Request, postId: string) {
  return apiRequestWithSession<GetBlogPostResponse>(
    request,
    `/blog/posts/${encodeURIComponent(postId)}`,
    { method: "GET" },
  );
}

// POST /v1/blog/posts
export async function createMyBlogPost(
  request: Request,
  payload: CreateBlogPostRequest,
) {
  return apiRequestWithSession<CreateBlogPostResponse, CreateBlogPostRequest>(
    request,
    "/blog/posts",
    { method: "POST", body: payload },
  );
}

// PATCH /v1/blog/posts/{id}
export async function updateMyBlogPost(
  request: Request,
  postId: string,
  payload: UpdateBlogPostRequest,
) {
  return apiRequestWithSession<UpdateBlogPostResponse, UpdateBlogPostRequest>(
    request,
    `/blog/posts/${encodeURIComponent(postId)}`,
    { method: "PATCH", body: payload },
  );
}

// DELETE /v1/blog/posts/{id}
export async function deleteMyBlogPost(request: Request, postId: string) {
  return apiRequestWithSession<DeleteBlogPostResponse>(
    request,
    `/blog/posts/${encodeURIComponent(postId)}`,
    { method: "DELETE" },
  );
}

// POST /v1/blog/posts/{id}/submit
export async function submitMyBlogPost(request: Request, postId: string) {
  return apiRequestWithSession<UpdateBlogPostResponse>(
    request,
    `/blog/posts/${encodeURIComponent(postId)}/submit`,
    { method: "POST" },
  );
}

// POST /v1/blog/posts/{id}/withdraw
export async function withdrawMyBlogPost(request: Request, postId: string) {
  return apiRequestWithSession<UpdateBlogPostResponse>(
    request,
    `/blog/posts/${encodeURIComponent(postId)}/withdraw`,
    { method: "POST" },
  );
}

// POST /v1/blog/posts/{id}/unpublish
export async function unpublishMyBlogPost(
  request: Request,
  postId: string,
  payload: UnpublishMyBlogPostRequest,
) {
  return apiRequestWithSession<
    UpdateBlogPostResponse,
    UnpublishMyBlogPostRequest
  >(request, `/blog/posts/${encodeURIComponent(postId)}/unpublish`, {
    method: "POST",
    body: payload,
  });
}

// POST /v1/blog/posts/image/presign
export async function presignMyBlogImage(
  request: Request,
  payload: PresignBlogImageUploadRequest,
) {
  return apiRequestWithSession<
    PresignBlogImageUploadResponse,
    PresignBlogImageUploadRequest
  >(request, "/blog/posts/image/presign", { method: "POST", body: payload });
}
