import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router";
import { BlogForm } from "../components/blog-form/blog-form";
import { MyBlogDetailSkeleton } from "../components/my-blog-detail-skeleton";
import { MyBlogNotFound } from "../components/my-blog-not-found";
import { myBlogEditAction } from "../services/my-blog-edit.action";
import { myBlogEditLoader } from "../services/my-blog-edit.loader";

export const loader = myBlogEditLoader;
export const action = myBlogEditAction;

export function meta() {
  return [{ title: "Edit Blog | True Khmer" }];
}

export function HydrateFallback() {
  return <MyBlogDetailSkeleton />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (
    isRouteErrorResponse(error) &&
    (error.status === 403 || error.status === 404)
  ) {
    return <MyBlogNotFound />;
  }
  throw error;
}

export default function MyBlogEditRoute() {
  const { post, categories, viewer } = useLoaderData<typeof myBlogEditLoader>();

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
      <BlogForm
        post={post}
        categories={categories}
        draftKey={post.id}
        viewer={viewer}
      />
    </div>
  );
}
