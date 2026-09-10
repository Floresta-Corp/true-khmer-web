import { useLoaderData, useSearchParams } from "react-router";
import { BlogForm } from "../components/blog-form/blog-form";
import { MyBlogDetailSkeleton } from "../components/my-blog-detail-skeleton";
import { myBlogNewAction } from "../services/my-blog-new.action";
import { myBlogNewLoader } from "../services/my-blog-new.loader";

export const loader = myBlogNewLoader;
export const action = myBlogNewAction;

export function meta() {
  return [{ title: "Write a Blog | True Khmer" }];
}

export function HydrateFallback() {
  return <MyBlogDetailSkeleton withCover={false} />;
}

export default function MyBlogNewRoute() {
  const { categories, viewer } = useLoaderData<typeof myBlogNewLoader>();
  const [searchParams] = useSearchParams();
  const draftKey = searchParams.get("fresh") ?? "new";

  return (
    <div className="min-h-full bg-[#f8fafc] p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
      <BlogForm
        categories={categories}
        draftKey={`new:${draftKey}`}
        viewer={viewer}
      />
    </div>
  );
}
