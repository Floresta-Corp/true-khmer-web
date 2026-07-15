import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from "react-router";
import { AccessRestricted } from "~/features/admin/components/access-restricted";
import { BlogForm } from "../components/blog-form";
import { blogNewAction } from "../services/blog-new.action";
import { blogNewLoader } from "../services/blog-new.loader";

export const loader = blogNewLoader;
export const action = blogNewAction;

export function meta() {
  return [{ title: "New Blog Post | True Khmer" }];
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 403) {
    return <AccessRestricted message={error.data?.message} />;
  }
  throw error;
}

export default function BlogNewRoute() {
  const { categories } = useLoaderData<typeof blogNewLoader>();
  const [searchParams] = useSearchParams();
  const draftKey = searchParams.get("fresh") ?? "new";

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
      <BlogForm categories={categories} draftKey={`new:${draftKey}`} />
    </div>
  );
}
