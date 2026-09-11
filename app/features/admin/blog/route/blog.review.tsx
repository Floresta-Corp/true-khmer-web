import { isRouteErrorResponse, useRouteError } from "react-router";
import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { BlogListPageSkeleton } from "../components/blog-list-page-skeleton";
import { BlogReviewPage } from "../components/pages/blog-review-page";
import { blogAction } from "../services/blog.action";
import { blogReviewLoader } from "../services/blog-review.loader";

export const loader = blogReviewLoader;
export const action = blogAction;

export function meta() {
  return [{ title: "Khmer Voices Review | True Khmer" }];
}

export function HydrateFallback() {
  return <BlogListPageSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function BlogReviewRoute() {
  return <BlogReviewPage />;
}
