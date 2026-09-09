import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { BLOG_UNPUBLISH_REASON_LABELS } from "~/lib/blog-status";
import { formatDateTime } from "~/lib/time";
import type { BlogPostResponse } from "~/types/api-client";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  );
}

export function BlogModerationSummary({ post }: { post: BlogPostResponse }) {
  const { moderation } = post;

  return (
    <Card className="rounded-[2rem] border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Moderation</h2>
      <div className="mt-4 space-y-3 text-sm">
        <Row
          label="Submitted"
          value={
            moderation.submittedAt
              ? formatDateTime(moderation.submittedAt)
              : "Not submitted"
          }
        />
        <Row
          label="Reviewed"
          value={
            moderation.reviewedAt
              ? formatDateTime(moderation.reviewedAt)
              : "Not reviewed"
          }
        />
        <Row
          label="Published"
          value={
            post.publishedAt
              ? formatDateTime(post.publishedAt)
              : "Not published"
          }
        />

        {moderation.rejectionReason ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2 leading-6 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <p className="font-medium">Rejection reason</p>
            <p className="mt-1">{moderation.rejectionReason}</p>
          </div>
        ) : null}

        {moderation.unpublishedAt ? (
          <div className="rounded-xl bg-amber-50 px-3 py-2 leading-6 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <p className="font-medium">
              Unpublished {formatDateTime(moderation.unpublishedAt)}
              {moderation.unpublishReason
                ? ` — ${BLOG_UNPUBLISH_REASON_LABELS[moderation.unpublishReason]}`
                : ""}
            </p>
            {moderation.unpublishNote ? (
              <p className="mt-1">{moderation.unpublishNote}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="outline">by {post.author.name}</Badge>
          {post.isFeatured ? (
            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300">
              Featured
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
