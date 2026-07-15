import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router";
import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { BlogForm } from "../components/blog-form";
import { blogEditAction } from "../services/blog-edit.action";
import { blogEditLoader } from "../services/blog-edit.loader";

export const loader = blogEditLoader;
export const action = blogEditAction;

export function meta() {
  return [{ title: "Edit Blog Post | True Khmer" }];
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

export default function BlogEditRoute() {
  const { post, categories } = useLoaderData<typeof blogEditLoader>();

  return (
    <div className="p-6">
      <BlogForm post={post} categories={categories} draftKey={post.id} />
    </div>
  );
}
