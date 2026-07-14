import { apiRequestPublic } from "~/lib/server/api-client.server";
import type {
  GetBlogCategoriesResponse,
  GetPublicBlogPostResponse,
  ListPublicBlogPostsResponse,
} from "~/types/api-client";

export interface ListPublicBlogPostsQuery {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  sort?: "newest" | "oldest";
}

// GET /v1/blog/public/posts
export async function getPublicBlogPosts(
  request: Request,
  query: ListPublicBlogPostsQuery,
) {
  const searchParams = new URLSearchParams();
  if (query.page !== undefined) searchParams.set("page", String(query.page));
  if (query.pageSize !== undefined)
    searchParams.set("pageSize", String(query.pageSize));
  if (query.categorySlug) searchParams.set("categorySlug", query.categorySlug);
  if (query.sort) searchParams.set("sort", query.sort);

  const queryString = searchParams.toString();

  return apiRequestPublic<ListPublicBlogPostsResponse>(
    request,
    `/blog/public/posts${queryString ? `?${queryString}` : ""}`,
    { method: "GET" },
  );
}

// GET /v1/blog/public/posts/{slug}
export async function getPublicBlogPostBySlug(request: Request, slug: string) {
  return apiRequestPublic<GetPublicBlogPostResponse>(
    request,
    `/blog/public/posts/${encodeURIComponent(slug)}`,
    { method: "GET" },
  );
}

// GET /v1/blog/public/category
export async function getPublicBlogCategories(request: Request) {
  return apiRequestPublic<GetBlogCategoriesResponse>(
    request,
    "/blog/public/category",
    { method: "GET" },
  );
}
