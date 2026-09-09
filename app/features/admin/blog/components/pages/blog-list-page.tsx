import { Suspense, useEffect, useState } from "react";
import {
  Await,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "~/components/confirmation-modal";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { BlogCategoryManager } from "../blog-category-manager";
import { BlogPostsGridSkeleton } from "../blog-list-page-skeleton";
import { BlogQueueFilters } from "../blog-queue-filters";
import { ModerationBlogCard } from "../card/moderation-blog-card";
import { BLOG_MODERATION_INTENTS } from "../../types";
import type { blogLoader } from "../../services/blog.loader";

export function BlogListPage() {
  const { content, filters } = useLoaderData<typeof blogLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const postFetcher = useFetcher<{
    ok: boolean;
    intent?: string;
    message?: string;
  }>();
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    postId: string;
    title: string;
  }>({ isOpen: false, postId: "", title: "" });

  const isLoadingContent =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  useEffect(() => {
    if (!postFetcher.data) return;
    if (postFetcher.data.ok) {
      toast.success(postFetcher.data.message || "Blog updated successfully.");
    } else {
      toast.error(postFetcher.data.message || "Blog action failed.");
    }
  }, [postFetcher.data]);

  function goToPage(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNumber));
    setSearchParams(params, { preventScrollReset: true });
  }

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 dark:bg-[#020617]">
      <div className="max-w-full space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Blogs
            </h1>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Community authors write blogs from their workspace. Moderators
              review submissions here, then approve, reject, or take a published
              blog off the site. Published blogs can be featured one at a time.
            </p>
          </div>
        </header>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="p-4 sm:p-6">
            <BlogCategoryManager
              content={content}
              isLoadingContent={isLoadingContent}
            />
            <BlogQueueFilters filters={filters} />
          </div>
        </Card>

        {isLoadingContent ? (
          <BlogPostsGridSkeleton />
        ) : (
          <Suspense fallback={<BlogPostsGridSkeleton />}>
            <Await
              resolve={content}
              errorElement={
                <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-5 py-12 text-center sm:min-h-80 dark:border-rose-900/60 dark:bg-rose-950/40">
                  <p className="text-lg font-semibold text-rose-700 sm:text-xl dark:text-rose-300">
                    Failed to load blogs
                  </p>
                </div>
              }
            >
              {({ posts, meta }) =>
                posts.length === 0 ? (
                  <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center sm:min-h-80 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-lg font-semibold text-slate-950 sm:text-xl dark:text-white">
                      No blogs found
                    </p>
                    <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                      Nothing matches these filters yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      {posts.map((post) => (
                        <ModerationBlogCard
                          key={post.id}
                          post={post}
                          onFeature={() =>
                            postFetcher.submit(
                              {
                                intent: BLOG_MODERATION_INTENTS.feature,
                                postId: post.id,
                                isFeatured: "true",
                              },
                              { method: "post" },
                            )
                          }
                          onDelete={() =>
                            setConfirmDelete({
                              isOpen: true,
                              postId: post.id,
                              title: post.title,
                            })
                          }
                        />
                      ))}
                    </div>

                    {meta.totalPages > 1 && (
                      <div className="flex flex-col items-center gap-4 pb-2 text-center">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Showing{" "}
                          <span className="font-medium">
                            {(meta.page - 1) * meta.pageSize + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium">
                            {Math.min(meta.page * meta.pageSize, meta.total)}
                          </span>{" "}
                          of <span className="font-medium">{meta.total}</span>{" "}
                          results
                        </div>
                        <div className="flex w-full items-center justify-center gap-1 sm:gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={meta.page <= 1}
                            onClick={() => goToPage(meta.page - 1)}
                          >
                            <ChevronLeft className="size-4" />
                            Previous
                          </Button>
                          <span className="mx-0 text-xs font-medium whitespace-nowrap text-slate-600 sm:mx-2 sm:text-sm dark:text-slate-400">
                            Page {meta.page} of {meta.totalPages}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            disabled={meta.page >= meta.totalPages}
                            onClick={() => goToPage(meta.page + 1)}
                          >
                            Next
                            <ChevronRight className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )
              }
            </Await>
          </Suspense>
        )}

        <ConfirmationModal
          isOpen={confirmDelete.isOpen}
          title="Delete Blog"
          message={`Delete "${confirmDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onClose={() =>
            setConfirmDelete({ isOpen: false, postId: "", title: "" })
          }
          onConfirm={() => {
            postFetcher.submit(
              {
                intent: BLOG_MODERATION_INTENTS.delete,
                postId: confirmDelete.postId,
              },
              { method: "post" },
            );
            setConfirmDelete({ isOpen: false, postId: "", title: "" });
          }}
          variant="error"
        />
      </div>
    </main>
  );
}
