import { isRouteErrorResponse, useRouteError } from "react-router";
import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { BlogListPage } from "../components/pages/blog-list-page";
import { blogAction } from "../services/blog.action";
import { blogLoader } from "../services/blog.loader";

export const loader = blogLoader;
export const action = blogAction;

export function meta() {
  return [{ title: "Blog | True Khmer" }];
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function BlogRoute() {
  return <BlogListPage />;
}
