import { Suspense, useCallback, useEffect, useState } from "react";
import {
  Await,
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
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
import {
  BlogCategoriesSkeleton,
  BlogPostsGridSkeleton,
} from "../blog-list-page-skeleton";
import type { blogLoader } from "../../services/blog.loader";

const postStatusStyles = {
  DRAFT:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
  PUBLISHED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
  ARCHIVED:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
} as const;

export function BlogListPage() {
  const { content, currentUserId, filters } =
    useLoaderData<typeof blogLoader>();
  const location = useLocation();
  const navigation = useNavigation();
  const isLoadingContent =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;
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
    <main className="min-h-full bg-[#f8fafc] px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 dark:bg-[#020617]">
      <div className="max-w-full space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Blogs
            </h1>
            <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Moderators can draft, publish, and manage long-form editorial blog
              posts here. Published blogs can be featured one at a time from the
              list below.
            </p>
          </div>
          <Button
            asChild
            className="h-10 w-full shrink-0 bg-blue-600 px-4 text-white hover:bg-blue-700 sm:w-auto dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          >
            <Link to="/tk-admin/blog/new">
              <Plus className="size-4.5" />
              New Blog
            </Link>
          </Button>
        </header>

        <Card className="overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <div className="p-4 sm:p-6">
            <section className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:mb-6 sm:p-5 lg:p-6 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                <div className="min-w-0 lg:flex-1">
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                    Categories
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
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
                    className="h-10 min-w-0 flex-1 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                  />
                  <Button
                    type="submit"
                    disabled={categoryFetcher.state !== "idle"}
                    className="h-10 w-full bg-blue-600 px-4 whitespace-nowrap text-white hover:bg-blue-700 sm:w-auto dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                  >
                    Create Category
                  </Button>
                </categoryFetcher.Form>
              </div>

              {categoryError ? (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {categoryError}
                </div>
              ) : null}

              {isLoadingContent ? (
                <BlogCategoriesSkeleton />
              ) : (
                <Suspense fallback={<BlogCategoriesSkeleton />}>
                  <Await
                    resolve={content}
                    errorElement={
                      <div className="mt-5 rounded-xl border border-dashed border-rose-200 bg-rose-50 px-4 py-5 text-center text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
                        Failed to load categories.
                      </div>
                    }
                  >
                    {(resolved) => (
                      <div className="mt-5 flex flex-wrap gap-3">
                        {resolved.categories.length > 0 ? (
                          resolved.categories.map((category) => (
                            <div
                              key={category.id}
                              className="flex w-full min-w-0 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition-colors sm:w-auto sm:gap-3 sm:px-4 dark:border-slate-700 dark:bg-slate-900"
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
                                  <Button
                                    type="submit"
                                    size="xs"
                                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    size="xs"
                                    variant="ghost"
                                    className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                    onClick={() => setEditingCategoryId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </categoryFetcher.Form>
                              ) : (
                                <div className="min-w-0 flex-1 sm:flex-none">
                                  <div className="text-sm font-semibold break-words text-slate-950 dark:text-slate-100">
                                    {category.name}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {category.postCount} article
                                    {category.postCount === 1 ? "" : "s"}
                                  </div>
                                </div>
                              )}
                              <Badge
                                variant="outline"
                                className={`gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${
                                  category.isVisible
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${category.isVisible ? "bg-emerald-500" : "bg-slate-400"}`}
                                />
                                {category.isVisible ? "Visible" : "Hidden"}
                              </Badge>
                              {editingCategoryId === category.id ? null : (
                                <Button
                                  type="button"
                                  size="xs"
                                  variant="ghost"
                                  className="rounded-lg px-2.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
                                  onClick={() =>
                                    setEditingCategoryId(category.id)
                                  }
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
                                <Button
                                  type="submit"
                                  size="xs"
                                  variant="ghost"
                                  className="rounded-lg px-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                  {category.isVisible ? "Hide" : "Show"}
                                </Button>
                              </categoryFetcher.Form>
                            </div>
                          ))
                        ) : (
                          <div className="w-full rounded-xl border border-dashed border-slate-200 bg-white px-4 py-5 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                            No categories yet. Create one so editors can assign
                            blogs to it.
                          </div>
                        )}
                      </div>
                    )}
                  </Await>
                </Suspense>
              )}
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
                    className="h-10 border-slate-200 bg-white pr-9 pl-9 dark:border-slate-700 dark:bg-slate-950/60"
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
                variant="ghost"
                className={`h-10 w-full rounded-lg border sm:w-auto ${
                  hasFilters
                    ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
                }`}
                onClick={() => setShowFilters((current) => !current)}
              >
                <Filter className="size-4" />
                Filters
              </Button>
            </div>

            {showFilters ? (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 sm:p-6 dark:bg-slate-950/60">
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
                    <SelectTrigger className="h-10 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
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
                    <SelectTrigger className="h-10 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
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
              {({ posts, meta }) => (
                <>
                  {posts.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center sm:min-h-80 dark:border-slate-800 dark:bg-slate-900">
                      <p className="text-lg font-semibold text-slate-950 sm:text-xl dark:text-white">
                        No blogs found
                      </p>
                      <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                        Create the first blog for the moderator team.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {posts.map((post) => (
                          <Card
                            key={post.id}
                            className="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700"
                          >
                            <div className="flex h-full min-w-0 flex-col gap-5 md:flex-row">
                              {post.coverImageUrl ? (
                                <img
                                  src={post.coverImageUrl}
                                  alt={post.coverImageAlt || post.title}
                                  className="aspect-video h-auto w-full shrink-0 rounded-xl object-cover md:aspect-auto md:h-52 md:w-56 xl:w-44 2xl:w-52"
                                />
                              ) : (
                                <div className="flex aspect-video h-auto w-full shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-slate-400 md:aspect-auto md:h-52 md:w-56 xl:w-44 2xl:w-52 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-500">
                                  <div className="text-sm font-medium">
                                    No cover image
                                  </div>
                                  <div className="mt-1 text-xs">
                                    Add a hero image to improve the card
                                    preview.
                                  </div>
                                </div>
                              )}
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="mb-3 flex flex-wrap gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${postStatusStyles[post.status]}`}
                                  >
                                    <span
                                      className={`size-1.5 rounded-full ${
                                        post.status === "PUBLISHED"
                                          ? "bg-emerald-500"
                                          : post.status === "ARCHIVED"
                                            ? "bg-rose-500"
                                            : "bg-sky-500"
                                      }`}
                                    />
                                    {post.status.toLowerCase()}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="rounded-lg border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {post.placement.toLowerCase()}
                                  </Badge>
                                  {post.categoryId ? (
                                    <Badge
                                      variant="outline"
                                      className="rounded-lg border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wider text-amber-700 uppercase dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                                    >
                                      {post.categoryName || "Unknown Category"}
                                    </Badge>
                                  ) : null}
                                  {post.isFeatured ? (
                                    <Badge
                                      variant="outline"
                                      className="rounded-lg border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
                                    >
                                      Featured on Blog
                                    </Badge>
                                  ) : null}
                                </div>
                                <h2
                                  className="line-clamp-3 text-xl leading-tight font-semibold break-words text-(--blog-secondary) sm:text-2xl xl:min-h-[5.5rem] dark:text-blue-300"
                                  title={post.title}
                                >
                                  {post.title}
                                </h2>
                                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 sm:min-h-[3rem] sm:text-base dark:text-slate-300">
                                  {post.excerpt}
                                </p>
                                <div className="mt-4 text-sm break-words text-slate-500 dark:text-slate-400">
                                  {post.authorName}
                                  {" • "}
                                  {formatDate(
                                    post.publishedAt || post.updatedAt,
                                  )}
                                </div>
                                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                  <Button
                                    asChild
                                    variant="ghost"
                                    className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                  >
                                    <Link to={`/tk-admin/blog/${post.id}`}>
                                      View
                                    </Link>
                                  </Button>
                                  {post.status === "PUBLISHED" ? (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className={
                                        post.isFeatured
                                          ? "rounded-lg border border-blue-900/60 bg-blue-950/40 text-blue-300"
                                          : "rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
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
                                      {post.isFeatured
                                        ? "Featured"
                                        : "Set as Featured"}
                                    </Button>
                                  ) : null}
                                  {post.createdBy === currentUserId ? (
                                    <>
                                      <Button
                                        asChild
                                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                                      >
                                        <Link
                                          to={`/tk-admin/blog/${post.id}/edit`}
                                        >
                                          Edit
                                        </Link>
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 dark:hover:text-rose-200"
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
                  )}
                </>
              )}
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
