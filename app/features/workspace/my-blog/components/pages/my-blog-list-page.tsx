import { Suspense, useEffect, useState } from "react";
import {
  Await,
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
} from "react-router";
import { NotebookPen, Plus } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "~/components/confirmation-modal";
import SpacePagination from "~/components/space-pagination";
import { Button } from "~/components/ui/button";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import { readActionResult } from "~/lib/action-result";
import { MyBlogCard } from "../card/my-blog-card";
import { MyBlogCardsSkeleton } from "../my-blog-list-skeleton";
import { MyBlogFilters } from "../my-blog-filters";
import { UnpublishMyBlogDialog } from "../blog-form/unpublish-my-blog-dialog";
import { MY_BLOG_ACTIONS } from "../../types";
import type { myBlogLoader } from "../../services/my-blog.loader";

const MY_BLOG_PATH = "/workspace/khmer-voices";

type PendingAction = { postId: string; title: string } | null;

function MyBlogEmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-105 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
      <NotebookPen size={42} className="mb-1.5 text-[#E5E7EB]" />
      <div className="text-[16px] font-bold text-[#1A1A2E]">{message}</div>
      <p className="m-0 text-[14px] text-[#9A9AB0]">
        Blogs you write appear here until a moderator publishes them.
      </p>
    </div>
  );
}

export function MyBlogListPage() {
  const { content, filters } = useLoaderData<typeof myBlogLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const [confirmDelete, setConfirmDelete] = useState<PendingAction>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState<PendingAction>(null);
  const [unpublishing, setUnpublishing] = useState<PendingAction>(null);

  const isLoadingContent =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  useEffect(() => {
    if (!fetcher.data) return;
    const { ok, message } = readActionResult(fetcher.data);
    if (ok) toast.success(message ?? "Blog updated successfully.");
    else toast.error(message ?? "Blog action failed.");
  }, [fetcher.data]);

  function runIntent(
    intent: string,
    postId: string,
    extra?: Record<string, string>,
  ) {
    fetcher.submit({ intent, postId, ...extra }, { method: "post" });
  }

  return (
    <WorkSpacePageLayout
      title="Khmer Voices"
      subtitle="Write your story and submit it for review"
      action={
        <Button
          asChild
          className="h-12 w-full rounded-xl bg-[#305CCD] px-6 text-[15px] font-bold text-white sm:w-auto [a]:hover:bg-[#2A51B8]"
        >
          <Link to={`${MY_BLOG_PATH}/new`}>
            <Plus size={18} strokeWidth={2.5} aria-hidden />
            Write a blog
          </Link>
        </Button>
      }
    >
      <div className="mb-6">
        <MyBlogFilters search={filters.search} status={filters.status} />
      </div>

      <div className="flex flex-1 flex-col">
        {isLoadingContent ? (
          <MyBlogCardsSkeleton />
        ) : (
          <Suspense fallback={<MyBlogCardsSkeleton />}>
            <Await
              resolve={content}
              errorElement={
                <MyBlogEmptyState message="Unable to load your blogs." />
              }
            >
              {({ posts, meta }) => (
                <>
                  {posts.length === 0 ? (
                    <MyBlogEmptyState message="No blogs yet." />
                  ) : (
                    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                      {posts.map((post) => (
                        <MyBlogCard
                          key={post.id}
                          post={post}
                          onWithdraw={() =>
                            setConfirmWithdraw({
                              postId: post.id,
                              title: post.title,
                            })
                          }
                          onUnpublish={() =>
                            setUnpublishing({
                              postId: post.id,
                              title: post.title,
                            })
                          }
                          onDelete={() =>
                            setConfirmDelete({
                              postId: post.id,
                              title: post.title,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* Pushed to the bottom of the page so it keeps a fixed spot
                      instead of riding up under a short grid. */}
                  {posts.length > 0 && (
                    <div className="mt-auto pt-10">
                      <SpacePagination
                        total={meta.total}
                        totalPages={meta.totalPages}
                        pageSize={meta.pageSize}
                        itemLabel="blogs"
                      />
                    </div>
                  )}
                </>
              )}
            </Await>
          </Suspense>
        )}
      </div>

      <ConfirmationModal
        isOpen={Boolean(confirmDelete)}
        title="Delete Blog"
        message={`Delete "${confirmDelete?.title ?? ""}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete) {
            runIntent(MY_BLOG_ACTIONS.delete, confirmDelete.postId);
          }
          setConfirmDelete(null);
        }}
        variant="error"
      />

      <ConfirmationModal
        isOpen={Boolean(confirmWithdraw)}
        title="Withdraw submission"
        message={`Pull "${confirmWithdraw?.title ?? ""}" back out of the review queue? It returns to a draft you can edit.`}
        confirmText="Withdraw"
        cancelText="Cancel"
        onClose={() => setConfirmWithdraw(null)}
        onConfirm={() => {
          if (confirmWithdraw) {
            runIntent(MY_BLOG_ACTIONS.withdraw, confirmWithdraw.postId);
          }
          setConfirmWithdraw(null);
        }}
        variant="warning"
      />

      <UnpublishMyBlogDialog
        isOpen={Boolean(unpublishing)}
        onClose={() => setUnpublishing(null)}
        onConfirm={(note) => {
          if (unpublishing) {
            runIntent(MY_BLOG_ACTIONS.unpublish, unpublishing.postId, { note });
          }
          setUnpublishing(null);
        }}
      />
    </WorkSpacePageLayout>
  );
}
