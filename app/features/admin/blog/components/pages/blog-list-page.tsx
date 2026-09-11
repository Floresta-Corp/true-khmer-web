import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import { Card } from "~/components/ui/card";
import { BlogAdminHeader } from "../blog-admin-header";
import { BlogQueueFilters } from "../blog-queue-filters";
import { PendingReviewBanner } from "../pending-review-banner";
import { BlogModerationList } from "../moderation/blog-moderation-list";
import type { blogLoader } from "../../services/blog.loader";

export function BlogListPage() {
  const { content, filters } = useLoaderData<typeof blogLoader>();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 dark:bg-[#020617]">
      <div className="max-w-full space-y-6 lg:space-y-8">
        <BlogAdminHeader description="Review and manage published, rejected, and unpublished Khmer Voices posts from community authors." />

        <Suspense fallback={null}>
          <Await resolve={content} errorElement={null}>
            {({ pendingCount }) => <PendingReviewBanner count={pendingCount} />}
          </Await>
        </Suspense>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="p-4 sm:p-6">
            <BlogQueueFilters filters={filters} />
          </div>
        </Card>

        <BlogModerationList
          content={content}
          emptyTitle="No blogs found"
          emptyDescription="Nothing matches these filters yet."
          errorTitle="Failed to load blogs"
        />
      </div>
    </main>
  );
}
