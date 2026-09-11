import { useEffect } from "react";
import { Link, useFetcher, useLoaderData, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SanitizedHtml } from "~/components/sanitized-html";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES,
  BLOG_CONTENT_EXTRA_ALLOWED_TAGS,
} from "~/lib/blog-content-sanitize";
import { resolveBlogAuthor } from "~/lib/blog-author";
import { BLOG_STATUS_LABELS, BLOG_STATUS_STYLES } from "~/lib/blog-status";
import { formatDate, formatDateTime } from "~/lib/time";
import { BlogModerationActions } from "../moderation/blog-moderation-actions";
import { BlogModerationSummary } from "../moderation/blog-moderation-summary";
import type { blogDetailLoader } from "../../services/blog-detail.loader";

export function BlogDetailPage() {
  const { post } = useLoaderData<typeof blogDetailLoader>();
  const fetcher = useFetcher<{ ok: boolean; message?: string }>();
  const navigate = useNavigate();
  const author = resolveBlogAuthor(post);
  const statusStyle = BLOG_STATUS_STYLES[post.status];

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.ok) {
      toast.success(fetcher.data.message || "Post updated successfully.");
    } else {
      toast.error(fetcher.data.message || "Moderation action failed.");
    }
  }, [fetcher.data]);

  function handleGoBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/tk-admin/khmer-voices");
  }

  return (
    <div className="min-h-full space-y-6 bg-[#f8fafc] p-6 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                to="/tk-admin/khmer-voices"
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                Khmer Voices
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-slate-900 dark:text-slate-100">
              {post.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
        <div>
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={handleGoBack}
              className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusStyle.badge}`}
            >
              <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
              {BLOG_STATUS_LABELS[post.status]}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-(--blog-secondary) dark:text-blue-300">
            {post.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            {post.excerpt}
          </p>
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {author.name}
            {author.role ? ` • ${author.role}` : ""}
            {" • "}
            {formatDate(post.publishedAt || post.updatedAt)}
          </div>
        </div>

        <BlogModerationActions post={post} fetcher={fetcher} />
      </div>

      {post.coverImageUrl ? (
        <figure className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            className="h-[420px] w-full object-cover"
          />
          {post.coverImageCaption ? (
            <figcaption className="px-6 py-4 text-center text-sm text-slate-500 italic dark:text-slate-400">
              {post.coverImageCaption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="rounded-[2rem] border-slate-100 bg-white p-6 text-slate-950 lg:p-10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
          <SanitizedHtml
            html={post.content}
            className="blog-rich-text max-w-none"
            extraAllowedTags={BLOG_CONTENT_EXTRA_ALLOWED_TAGS}
            extraAllowedAttributes={BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES}
          />
        </Card>

        <div className="space-y-6">
          <BlogModerationSummary post={post} />

          <Card className="rounded-[2rem] border-slate-100 bg-white p-6 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <h2 className="text-lg font-semibold">Publishing</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="font-medium">Slug:</span>
                <span className="ml-2 font-mono">{post.slug}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{formatDateTime(post.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium">Updated:</span>
                <span className="ml-2">{formatDateTime(post.updatedAt)}</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white p-6 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <h2 className="text-lg font-semibold">Category</h2>
            <div className="mt-4">
              {post.categoryName ? (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
                  {post.categoryName}
                </Badge>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  No category
                </span>
              )}
            </div>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white p-6 text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.length > 0 ? (
                post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  No tags
                </span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
