import { useCallback, useEffect, useState } from "react";
import { Link, useFetcher, useLoaderData, useSearchParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ConfirmationModal } from "~/features/admin/components/confirmation-modal";
import { formatDate } from "~/lib/time";
import { toast } from "sonner";
import type { blogLoader } from "../../services/blog.loader";

export function BlogListPage() {
  const { posts, meta, categories, currentUserId, filters } =
    useLoaderData<typeof blogLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFetcher = useFetcher<{
    ok: boolean;
    intent?: string;
    message?: string;
    categoryId?: string;
  }>();
  const postFetcher = useFetcher<{
    ok: boolean;
    intent?: string;
    message?: string;
  }>();
  const categoryResult = categoryFetcher.data;
  const categoryError =
    categoryResult && !categoryResult.ok ? categoryResult.message : null;
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    postId: string;
    title: string;
  }>({ isOpen: false, postId: "", title: "" });

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
      params.set("page", "1");
      setSearchParams(params, { replace: true, preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), {
      replace: true,
      preventScrollReset: true,
    });
    setSearchValue("");
  }, [setSearchParams]);

  useEffect(() => {
    if ((searchParams.get("search") ?? "") === searchValue) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchValue) params.set("search", searchValue);
      else params.delete("search");
      params.set("page", "1");
      setSearchParams(params, { replace: true, preventScrollReset: true });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchParams, searchValue, setSearchParams]);

  useEffect(() => {
    if (!categoryFetcher.data) return;
    if (!categoryFetcher.data.ok) {
      toast.error(categoryFetcher.data.message || "Category action failed.");
      return;
    }

    toast.success(
      categoryFetcher.data.message || "Category updated successfully.",
    );
    const intent = categoryFetcher.data.intent;
    if (intent === "updateCategory") {
      setEditingCategoryId(null);
    } else if (intent === "createCategory") {
      setNewCategoryName("");
    }
  }, [categoryFetcher.data]);

  useEffect(() => {
    if (!postFetcher.data) return;
    if (postFetcher.data.ok) {
      toast.success(postFetcher.data.message || "Blog updated successfully.");
    } else {
      toast.error(postFetcher.data.message || "Blog action failed.");
    }
  }, [postFetcher.data]);

  const hasFilters = Boolean(
    filters.search || filters.status || filters.placement,
  );

  function goToPage(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(pageNumber));
    setSearchParams(params, { preventScrollReset: true });
  }

  return (
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 dark:bg-[#020617]">
      <div className="mx-auto w-full max-w-[1400px] space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Blogs
            </h1>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-foreground/60 sm:text-base">
              Moderators can draft, publish, and manage long-form editorial blog
              posts here. Published blogs can be featured one at a time from the
              list below.
            </p>
          </div>
          <Button asChild className="h-10 w-full shrink-0 px-4 sm:w-auto">
            <Link to="/tk-admin/blog/new">
              <Plus className="size-4.5" />
              New Blog
            </Link>
          </Button>
        </header>

        <Card className="overflow-hidden rounded-2xl border-border bg-background shadow-sm">
          <div className="p-4 sm:p-6">
            <section className="mb-5 rounded-2xl border border-border bg-muted/20 p-4 sm:mb-6 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <div className="min-w-0 lg:flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    Categories
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-foreground/60">
                    Moderators control which categories appear in the public
                    blog filter and inside the editor category dropdown.
                  </p>
                </div>

                <categoryFetcher.Form
                  method="post"
                  className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:max-w-lg lg:flex-1"
                >
                  <input type="hidden" name="intent" value="createCategory" />
                  <Input
                    type="text"
                    name="name"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Add a new category"
                    className="h-10 min-w-0 flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={categoryFetcher.state !== "idle"}
                    className="h-10 w-full px-4 whitespace-nowrap sm:w-auto"
                  >
                    Create Category
                  </Button>
                </categoryFetcher.Form>
              </div>

              {categoryError ? (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {categoryError}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex w-full min-w-0 flex-wrap items-center gap-2 rounded-2xl border border-border bg-background px-3 py-3 shadow-sm sm:w-auto sm:gap-3 sm:rounded-full sm:px-4"
                    >
                      {editingCategoryId === category.id ? (
                        <categoryFetcher.Form
                          method="post"
                          className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto"
                        >
                          <input
                            type="hidden"
                            name="intent"
                            value="updateCategory"
                          />
                          <input
                            type="hidden"
                            name="categoryId"
                            value={category.id}
                          />
                          <Input
                            type="text"
                            name="name"
                            defaultValue={category.name}
                            className="min-w-0 flex-1 sm:w-44 sm:flex-none"
                            aria-label={`Edit ${category.name} category`}
                          />
                          <Button type="submit" size="xs">
                            Save
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            variant="ghost"
                            onClick={() => setEditingCategoryId(null)}
                          >
                            Cancel
                          </Button>
                        </categoryFetcher.Form>
                      ) : (
                        <div className="min-w-0 flex-1 sm:flex-none">
                          <div className="text-sm font-semibold break-words text-foreground">
                            {category.name}
                          </div>
                          <div className="text-xs text-foreground/55">
                            {category.postCount} article
                            {category.postCount === 1 ? "" : "s"}
                          </div>
                        </div>
                      )}
                      <Badge
                        variant={category.isVisible ? "default" : "secondary"}
                        className={`rounded-full ${
                          category.isVisible
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : ""
                        }`}
                      >
                        {category.isVisible ? "Visible" : "Hidden"}
                      </Badge>
                      {editingCategoryId === category.id ? null : (
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          onClick={() => setEditingCategoryId(category.id)}
                        >
                          Edit
                        </Button>
                      )}
                      <categoryFetcher.Form method="post">
                        <input
                          type="hidden"
                          name="intent"
                          value="toggleCategoryVisibility"
                        />
                        <input
                          type="hidden"
                          name="categoryId"
                          value={category.id}
                        />
                        <input
                          type="hidden"
                          name="isVisible"
                          value={category.isVisible ? "false" : "true"}
                        />
                        <Button type="submit" size="xs" variant="outline">
                          {category.isVisible ? "Hide" : "Show"}
                        </Button>
                      </categoryFetcher.Form>
                    </div>
                  ))
                ) : (
                  <div className="w-full rounded-xl border border-dashed border-border bg-background px-4 py-5 text-sm leading-6 text-foreground/60">
                    No categories yet. Create one so editors can assign blogs to
                    it.
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="min-w-0 flex-1">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search by title, excerpt, or author..."
                    className="pr-9 pl-9"
                  />
                  {searchValue ? (
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                      onClick={() => setSearchValue("")}
                      aria-label="Clear search"
                    >
                      <X className="size-3.5 text-muted-foreground" />
                    </Button>
                  ) : null}
                </div>
              </div>
              <Button
                type="button"
                variant={hasFilters ? "default" : "outline"}
                className={`w-full sm:w-auto ${hasFilters ? "bg-(--blog-secondary)" : ""}`}
                onClick={() => setShowFilters((current) => !current)}
              >
                <Filter className="size-4" />
                Filters
              </Button>
            </div>

            {showFilters ? (
              <div className="mt-4 rounded-2xl bg-muted p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">Filter Options</h3>
                  {hasFilters && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={clearFilters}
                    >
                      <X className="size-4" />
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => updateQuery("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.placement || "all"}
                    onValueChange={(value) => updateQuery("placement", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All placements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All placements</SelectItem>
                      <SelectItem value="HOME">Homepage</SelectItem>
                      <SelectItem value="CONTACT">Contact Page</SelectItem>
                      <SelectItem value="NONE">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        {posts.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-5 py-12 text-center sm:min-h-80">
            <p className="text-lg font-semibold text-foreground sm:text-xl">
              No blogs found
            </p>
            <p className="max-w-md text-sm leading-6 text-foreground/70 sm:text-base">
              Create the first blog for the moderator team.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="h-full min-w-0 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6"
                >
                  <div className="flex h-full min-w-0 flex-col gap-5 md:flex-row">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.coverImageAlt || post.title}
                        className="aspect-video h-auto w-full shrink-0 rounded-xl object-cover md:aspect-auto md:h-52 md:w-56 xl:w-44 2xl:w-52"
                      />
                    ) : (
                      <div className="flex aspect-video h-auto w-full shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/45 px-4 text-center text-foreground/45 md:aspect-auto md:h-52 md:w-56 xl:w-44 2xl:w-52">
                        <div className="text-sm font-medium">
                          No cover image
                        </div>
                        <div className="mt-1 text-xs">
                          Add a hero image to improve the card preview.
                        </div>
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize">
                          {post.status.toLowerCase()}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {post.placement.toLowerCase()}
                        </Badge>
                        {post.categoryId ? (
                          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">
                            {post.categoryName || "Unknown Category"}
                          </Badge>
                        ) : null}
                        {post.isFeatured ? (
                          <Badge>Featured on Blog</Badge>
                        ) : null}
                      </div>
                      <h2
                        className="line-clamp-3 text-xl leading-tight font-semibold break-words text-(--blog-secondary) sm:text-2xl xl:min-h-[5.5rem]"
                        title={post.title}
                      >
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground/70 sm:min-h-[3rem] sm:text-base">
                        {post.excerpt}
                      </p>
                      <div className="mt-4 text-sm break-words text-foreground/60">
                        {post.authorName}
                        {" • "}
                        {formatDate(post.publishedAt || post.updatedAt)}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        <Button asChild variant="outline">
                          <Link to={`/tk-admin/blog/${post.id}`}>View</Link>
                        </Button>
                        {post.status === "PUBLISHED" ? (
                          <Button
                            type="button"
                            variant={post.isFeatured ? "default" : "outline"}
                            className={
                              post.isFeatured ? "bg-(--blog-secondary)" : ""
                            }
                            disabled={post.isFeatured}
                            onClick={() => {
                              if (post.isFeatured) return;
                              postFetcher.submit(
                                {
                                  intent: "feature",
                                  postId: post.id,
                                  isFeatured: "true",
                                },
                                { method: "post" },
                              );
                            }}
                          >
                            {post.isFeatured ? "Featured" : "Set as Featured"}
                          </Button>
                        ) : null}
                        {post.createdBy === currentUserId ? (
                          <>
                            <Button asChild>
                              <Link to={`/tk-admin/blog/${post.id}/edit`}>
                                Edit
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() =>
                                setConfirmDelete({
                                  isOpen: true,
                                  postId: post.id,
                                  title: post.title,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 pb-2 text-center">
                <div className="text-sm text-foreground/70">
                  Showing{" "}
                  <span className="font-medium">
                    {(meta.page - 1) * meta.pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(meta.page * meta.pageSize, meta.total)}
                  </span>{" "}
                  of <span className="font-medium">{meta.total}</span> results
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
                  <span className="mx-0 text-xs font-medium whitespace-nowrap text-foreground/70 sm:mx-2 sm:text-sm">
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
              { intent: "delete", postId: confirmDelete.postId },
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
