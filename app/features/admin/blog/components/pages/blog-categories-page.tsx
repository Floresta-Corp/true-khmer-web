import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { BlogAdminHeader } from "../blog-admin-header";
import { BlogCategoryManager } from "../blog-category-manager";
import { BlogCategoriesSkeleton } from "../blog-list-page-skeleton";
import type { blogCategoriesLoader } from "../../services/blog-categories.loader";

export function BlogCategoriesPage() {
  const { content, filters } = useLoaderData<typeof blogCategoriesLoader>();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 dark:bg-[#020617]">
      <div className="max-w-full space-y-6 lg:space-y-8">
        <BlogAdminHeader description="Manage Khmer Voices categories to organize content and help authors choose the right category for their posts." />

        <Suspense fallback={<BlogCategoriesSkeleton />}>
          <Await
            resolve={content}
            errorElement={
              <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-5 py-12 text-center text-sm font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                Failed to load categories.
              </div>
            }
          >
            {(categories) => (
              <BlogCategoryManager
                categories={categories}
                initialSearch={filters.search ?? ""}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </main>
  );
}
