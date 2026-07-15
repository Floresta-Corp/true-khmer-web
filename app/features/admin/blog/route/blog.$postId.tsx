import { isRouteErrorResponse, useRouteError } from "react-router";
import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { BlogDetailPage } from "../components/pages/blog-detail-page";
import { blogDetailAction } from "../services/blog-detail.action";
import { blogDetailLoader } from "../services/blog-detail.loader";

export const loader = blogDetailLoader;
export const action = blogDetailAction;

export function meta() {
  return [{ title: "Blog Post | True Khmer" }];
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (
    isRouteErrorResponse(error) &&
    (error.status === 403 || error.status === 404)
  ) {
    return (
      <AccessRestricted
        message={error.data?.message ?? "Blog post not found."}
      />
    );
  }
  throw error;
}

export default function BlogDetailRoute() {
  return <BlogDetailPage />;
}
