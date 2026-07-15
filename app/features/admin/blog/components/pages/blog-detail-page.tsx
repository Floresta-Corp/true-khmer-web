import { useEffect, useState } from "react";
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
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
import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import {
  BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES,
  BLOG_CONTENT_EXTRA_ALLOWED_TAGS,
} from "~/lib/blog-content-sanitize";
import { formatDate, formatDateTime } from "~/lib/time";
import type { blogDetailLoader } from "../../services/blog-detail.loader";

export function BlogDetailPage() {
  const { post, canManage } = useLoaderData<typeof blogDetailLoader>();
  const fetcher = useFetcher<{
    ok: boolean;
    message?: string;
    redirectTo?: string;
  }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("created") !== "1") return;
    toast.success("Blog created successfully.");
    const next = new URLSearchParams(searchParams);
    next.delete("created");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!fetcher.data) return;
    if (fetcher.data.ok) {
      toast.success(fetcher.data.message || "Blog deleted successfully.");
      if (fetcher.data.redirectTo) {
        navigate(fetcher.data.redirectTo);
      }
    } else {
      toast.error(fetcher.data.message || "Unable to delete the blog.");
    }
  }, [fetcher.data, navigate]);

  function handleGoBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/tk-admin/blog");
  }

  return (
    <div className="min-h-full space-y-6 bg-[#f8fafc] p-6 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/tk-admin/blog">Blogs</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              onClick={handleGoBack}
              className="rounded-full text-muted-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </Button>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {post.status.toLowerCase()}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {post.placement.toLowerCase()}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-(--blog-secondary) dark:text-blue-300">
            {post.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            {post.excerpt}
          </p>
          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {post.authorName}
            {post.authorRole ? ` • ${post.authorRole}` : ""}
            {" • "}
            {formatDate(post.publishedAt || post.updatedAt)}
          </div>
        </div>
        {canManage ? (
          <div className="flex gap-2">
            <Button asChild>
              <Link to={`/tk-admin/blog/${post.id}/edit`}>Edit</Link>
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        ) : null}
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
        <Card className="rounded-[2rem] border-slate-100 bg-white p-6 lg:p-10 dark:border-slate-800 dark:bg-slate-900">
          <SanitizedHtml
            html={post.content}
            className="blog-rich-text max-w-none"
            extraAllowedTags={BLOG_CONTENT_EXTRA_ALLOWED_TAGS}
            extraAllowedAttributes={BLOG_CONTENT_EXTRA_ALLOWED_ATTRIBUTES}
          />
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
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
              <div>
                <span className="font-medium">Published:</span>
                <span className="ml-2">
                  {post.publishedAt
                    ? formatDateTime(post.publishedAt)
                    : "Not published"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
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

          <Card className="rounded-[2rem] border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.length > 0 ? (
                post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
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

      <ConfirmationModal
        isOpen={isDeleteOpen}
        title="Delete Blog"
        message={`Delete "${post.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
          setIsDeleteOpen(false);
          fetcher.submit({ intent: "delete" }, { method: "post" });
        }}
        variant="error"
      />
    </div>
  );
}
