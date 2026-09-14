import type { ReactNode } from "react";
import { Suspense } from "react";
import { Await } from "react-router";
import { ConfirmationModal } from "~/components/confirmation-modal";
import type {
  BlogPostSummaryResponse,
  ListModerationBlogPostsResponse,
} from "~/types/api-client";
import { BlogPostsGridSkeleton } from "../blog-list-page-skeleton";
import { BlogPagination } from "../blog-pagination";
import { ModerationBlogCard } from "../card/moderation-blog-card";
import { useBlogModerationList } from "./use-blog-moderation-list";

interface ModerationListData {
  posts: BlogPostSummaryResponse[];
  meta: ListModerationBlogPostsResponse["meta"];
}

interface BlogModerationListProps {
  content: Promise<ModerationListData>;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon?: ReactNode;
  errorTitle: string;
  paginationLabel?: string;
}

export function BlogModerationList({
  content,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  errorTitle,
  paginationLabel,
}: BlogModerationListProps) {
  const list = useBlogModerationList();

  return (
    <>
      {list.isLoadingContent ? (
        <BlogPostsGridSkeleton />
      ) : (
        <Suspense fallback={<BlogPostsGridSkeleton />}>
          <Await
            resolve={content}
            errorElement={<ModerationListError title={errorTitle} />}
          >
            {({ posts, meta }) =>
              posts.length === 0 ? (
                <ModerationListEmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  icon={emptyIcon}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {posts.map((post) => (
                      <ModerationBlogCard
                        key={post.id}
                        post={post}
                        onFeature={() => list.featurePost(post.id)}
                        onDelete={() => list.requestDelete(post)}
                      />
                    ))}
                  </div>

                  <BlogPagination
                    meta={meta}
                    onPageChange={list.goToPage}
                    label={paginationLabel}
                  />
                </>
              )
            }
          </Await>
        </Suspense>
      )}

      <ConfirmationModal
        isOpen={Boolean(list.pendingDelete)}
        title="Delete Post"
        message={`Delete "${list.pendingDelete?.title ?? ""}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={list.closeDeleteDialog}
        onConfirm={list.confirmDelete}
        variant="error"
        loading={list.isMutating}
      />
    </>
  );
}

function ModerationListError({ title }: { title: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-rose-200 bg-rose-50 px-5 py-12 text-center sm:min-h-80 dark:border-rose-900/60 dark:bg-rose-950/40">
      <p className="text-lg font-semibold text-rose-700 sm:text-xl dark:text-rose-300">
        {title}
      </p>
    </div>
  );
}

function ModerationListEmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center sm:min-h-80 dark:border-slate-800 dark:bg-slate-900">
      {icon}
      <p className="text-lg font-semibold text-slate-950 sm:text-xl dark:text-white">
        {title}
      </p>
      <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
