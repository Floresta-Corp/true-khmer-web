import { isRouteErrorResponse, useRouteError } from "react-router";
import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { BlogCategoriesPageSkeleton } from "../components/blog-list-page-skeleton";
import { BlogCategoriesPage } from "../components/pages/blog-categories-page";
import { blogCategoriesAction } from "../services/blog-categories.action";
import { blogCategoriesLoader } from "../services/blog-categories.loader";

export const loader = blogCategoriesLoader;
export const action = blogCategoriesAction;

export function meta() {
  return [{ title: "Khmer Voices Categories | True Khmer" }];
}

export function HydrateFallback() {
  return <BlogCategoriesPageSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function BlogCategoriesRoute() {
  return <BlogCategoriesPage />;
}
