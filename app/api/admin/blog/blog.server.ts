import { redirect } from "react-router";

import {
  apiRequestWithAccessToken,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  CreateBlogCategoryRequest,
  CreateBlogCategoryResponse,
  DeleteBlogPostResponse,
  GetBlogCategoriesResponse,
  GetBlogPostResponse,
  ListModerationBlogPostsResponse,
  RejectBlogPostRequest,
  SetBlogPostFeaturedRequest,
  UnpublishBlogPostRequest,
  UpdateBlogCategoryRequest,
  UpdateBlogCategoryResponse,
  UpdateBlogPostResponse,
} from "~/types/api-client";

async function retryAdminRequestAfterRefresh<T>(
  request: Request,
  execute: (accessToken: string) => Promise<T>,
  firstAccessToken?: string,
) {
  const tokenResult = firstAccessToken
    ? { accessToken: firstAccessToken, setCookie: undefined }
    : await getAdminAccessToken(request);

  if (!tokenResult.accessToken) {
    throw redirect("/tk-admin/login");
  }

  try {
    return {
      data: await execute(tokenResult.accessToken),
      setCookie: tokenResult.setCookie,
    };
  } catch (error) {
    if (!(error instanceof ProtectedApiError) || error.status !== 401) {
      throw error;
    }

    const refreshed = await getAdminAccessToken(request, {
      forceRefresh: true,
    });
    if (!refreshed.accessToken) {
      throw redirect("/tk-admin/login", {
        ...(refreshed.setCookie
          ? { headers: { "Set-Cookie": refreshed.setCookie } }
          : {}),
      });
    }

    return {
      data: await execute(refreshed.accessToken),
      setCookie: refreshed.setCookie ?? tokenResult.setCookie,
    };
  }
}

export interface ListModeratorBlogPostsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ModerationBlogPostStatus;
  categoryId?: string;
  sortField?:
    | "createdAt"
    | "updatedAt"
    | "publishedAt"
    | "submittedAt"
    | "title";
  sortOrder?: "asc" | "desc";
}

export type ModerationBlogPostStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "UNPUBLISHED";

// GET /v1/admin/blog/posts
export async function getModeratorBlogPosts(
  request: Request,
  query: ListModeratorBlogPostsQuery,
) {
  const searchParams = new URLSearchParams();
  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.pageSize !== undefined)
    searchParams.set("pageSize", String(query.pageSize));
  if (query.search) searchParams.set("search", query.search);
  if (query.status) searchParams.set("status", query.status);
  if (query.categoryId) searchParams.set("categoryId", query.categoryId);
  if (query.sortField) searchParams.set("sortField", query.sortField);
  if (query.sortOrder) searchParams.set("sortOrder", query.sortOrder);

  const queryString = searchParams.toString();

  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<ListModerationBlogPostsResponse>(
      request,
      accessToken,
      `/admin/blog/posts${queryString ? `?${queryString}` : ""}`,
      { method: "GET" },
    ),
  );
}

// GET /v1/admin/blog/posts/{id}
export async function getModeratorBlogPost(request: Request, postId: string) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<GetBlogPostResponse>(
      request,
      accessToken,
      `/admin/blog/posts/${encodeURIComponent(postId)}`,
      { method: "GET" },
    ),
  );
}

// POST /v1/admin/blog/posts/{id}/approve
export async function approveBlogPost(request: Request, postId: string) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<UpdateBlogPostResponse>(
      request,
      accessToken,
      `/admin/blog/posts/${encodeURIComponent(postId)}/approve`,
      { method: "POST" },
    ),
  );
}

// POST /v1/admin/blog/posts/{id}/reject
export async function rejectBlogPost(
  request: Request,
  postId: string,
  payload: RejectBlogPostRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<UpdateBlogPostResponse, RejectBlogPostRequest>(
      request,
      accessToken,
      `/admin/blog/posts/${encodeURIComponent(postId)}/reject`,
      { method: "POST", body: payload },
    ),
  );
}

// POST /v1/admin/blog/posts/{id}/unpublish
export async function unpublishBlogPost(
  request: Request,
  postId: string,
  payload: UnpublishBlogPostRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<UpdateBlogPostResponse, UnpublishBlogPostRequest>(
      request,
      accessToken,
      `/admin/blog/posts/${encodeURIComponent(postId)}/unpublish`,
      { method: "POST", body: payload },
    ),
  );
}

// DELETE /v1/admin/blog/posts/{id}
export async function deleteBlogPost(request: Request, postId: string) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<DeleteBlogPostResponse>(
      request,
      accessToken,
      `/admin/blog/posts/${encodeURIComponent(postId)}`,
      { method: "DELETE" },
    ),
  );
}

// POST /v1/admin/blog/posts/{id}/featured
export async function setBlogPostFeatured(
  request: Request,
  postId: string,
  payload: SetBlogPostFeaturedRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      UpdateBlogPostResponse,
      SetBlogPostFeaturedRequest
    >(
      request,
      accessToken,
      `/admin/blog/posts/${encodeURIComponent(postId)}/featured`,
      {
        method: "POST",
        body: payload,
      },
    ),
  );
}

// GET /v1/admin/blog/category
export async function getModeratorBlogCategories(request: Request) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<GetBlogCategoriesResponse>(
      request,
      accessToken,
      "/admin/blog/category",
      { method: "GET" },
    ),
  );
}

// POST /v1/admin/blog/category
export async function createBlogCategory(
  request: Request,
  payload: CreateBlogCategoryRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      CreateBlogCategoryResponse,
      CreateBlogCategoryRequest
    >(request, accessToken, "/admin/blog/category", {
      method: "POST",
      body: payload,
    }),
  );
}

// PATCH /v1/admin/blog/category/{id}
export async function updateBlogCategory(
  request: Request,
  categoryId: string,
  payload: UpdateBlogCategoryRequest,
) {
  return retryAdminRequestAfterRefresh(request, (accessToken) =>
    apiRequestWithAccessToken<
      UpdateBlogCategoryResponse,
      UpdateBlogCategoryRequest
    >(
      request,
      accessToken,
      `/admin/blog/category/${encodeURIComponent(categoryId)}`,
      {
        method: "PATCH",
        body: payload,
      },
    ),
  );
}
