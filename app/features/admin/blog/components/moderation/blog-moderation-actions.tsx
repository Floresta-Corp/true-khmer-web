import { useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { Button } from "~/components/ui/button";
import { ConfirmationModal } from "~/components/confirmation-modal";
import type { BlogPostResponse } from "~/types/api-client";
import { BLOG_MODERATION_INTENTS } from "../../types";
import { RejectBlogDialog } from "./reject-blog-dialog";
import { UnpublishBlogDialog } from "./unpublish-blog-dialog";

interface BlogModerationActionsProps {
  post: BlogPostResponse;
  fetcher: FetcherWithComponents<unknown>;
}

export function BlogModerationActions({
  post,
  fetcher,
}: BlogModerationActionsProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isUnpublishOpen, setIsUnpublishOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const isBusy = fetcher.state !== "idle";

  const canApprove =
    post.status === "PENDING_REVIEW" || post.status === "UNPUBLISHED";
  const canReject = post.status === "PENDING_REVIEW";
  const canUnpublish = post.status === "PUBLISHED";

  function submit(intent: string, fields?: Record<string, string>) {
    fetcher.submit({ intent, ...fields }, { method: "post" });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canApprove ? (
        <Button
          type="button"
          disabled={isBusy}
          onClick={() => setIsApproveOpen(true)}
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {post.status === "UNPUBLISHED" ? "Republish" : "Approve & publish"}
        </Button>
      ) : null}

      {canReject ? (
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={() => setIsRejectOpen(true)}
          className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-950/40"
        >
          Reject
        </Button>
      ) : null}

      {canUnpublish ? (
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={() => setIsUnpublishOpen(true)}
          className="border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-950/40"
        >
          Unpublish
        </Button>
      ) : null}

      {post.status === "PUBLISHED" ? (
        <Button
          type="button"
          variant="outline"
          disabled={isBusy || post.isFeatured}
          onClick={() =>
            submit(BLOG_MODERATION_INTENTS.feature, { isFeatured: "true" })
          }
          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900/60 dark:text-blue-300 dark:hover:bg-blue-950/40"
        >
          {post.isFeatured ? "Featured" : "Set as Featured"}
        </Button>
      ) : null}

      <Button
        type="button"
        variant="destructive"
        disabled={isBusy}
        onClick={() => setIsDeleteOpen(true)}
      >
        Delete
      </Button>

      <ConfirmationModal
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={() => {
          setIsApproveOpen(false);
          submit(BLOG_MODERATION_INTENTS.approve);
        }}
        title="Publish blog"
        message="Publish this blog now? It becomes visible on the public website."
        confirmText="Publish"
        cancelText="Cancel"
        variant="info"
      />

      <RejectBlogDialog
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={(reason) => {
          setIsRejectOpen(false);
          submit(BLOG_MODERATION_INTENTS.reject, { reason });
        }}
      />

      <UnpublishBlogDialog
        isOpen={isUnpublishOpen}
        onClose={() => setIsUnpublishOpen(false)}
        onConfirm={({ reason, note }) => {
          setIsUnpublishOpen(false);
          submit(BLOG_MODERATION_INTENTS.unpublish, { reason, note });
        }}
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          submit(BLOG_MODERATION_INTENTS.delete);
        }}
        title="Delete Blog"
        message={`Delete "${post.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="error"
      />
    </div>
  );
}
