import { Link, useLoaderData } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { BlogQueueFilters } from "../blog-queue-filters";
import { BlogModerationList } from "../moderation/blog-moderation-list";
import type { blogReviewLoader } from "../../services/blog-review.loader";

export function BlogReviewPage() {
  const { content, filters } = useLoaderData<typeof blogReviewLoader>();

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 dark:bg-[#020617]">
      <div className="max-w-full space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-4">
          <Button
            asChild
            variant="ghost"
            className="w-fit rounded-lg px-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <Link to="/tk-admin/khmer-voices">
              <ArrowLeft className="size-4" />
              Back to Khmer Voices
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Pending review
            </h1>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Blogs submitted by community authors, oldest submission first.
              Open one to approve or reject it — approved blogs move to the main
              blog list.
            </p>
          </div>
        </header>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="p-4 sm:p-6">
            <BlogQueueFilters
              filters={filters}
              showStatusFilter={false}
              showSubmissionSort
              searchPlaceholder="Search submissions by title, excerpt, or author..."
            />
          </div>
        </Card>

        <BlogModerationList
          content={content}
          emptyTitle={
            filters.search ? "No matching submissions" : "All caught up"
          }
          emptyDescription={
            filters.search
              ? "No pending post matches this search."
              : "There are no posts waiting for review right now."
          }
          emptyIcon={<CheckCircle2 className="size-8 text-emerald-500" />}
          errorTitle="Failed to load submissions"
          paginationLabel="submissions"
        />
      </div>
    </main>
  );
}
