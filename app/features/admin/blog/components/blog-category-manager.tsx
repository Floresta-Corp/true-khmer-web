import { Suspense, useEffect, useState } from "react";
import { Await, useFetcher } from "react-router";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { BlogCategoryWithUsageResponse } from "~/types/api-client";
import { BlogCategoriesSkeleton } from "./blog-list-page-skeleton";

interface BlogCategoryManagerProps {
  content: Promise<{ categories: BlogCategoryWithUsageResponse[] }>;
  isLoadingContent: boolean;
}

export function BlogCategoryManager({
  content,
  isLoadingContent,
}: BlogCategoryManagerProps) {
  const categoryFetcher = useFetcher<{
    ok: boolean;
    intent?: string;
    message?: string;
    categoryId?: string;
  }>();
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const categoryResult = categoryFetcher.data;
  const categoryError =
    categoryResult && !categoryResult.ok ? categoryResult.message : null;

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

  return (
    <section className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:mb-6 sm:p-5 lg:p-6 dark:border-slate-800 dark:bg-slate-950/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 lg:flex-1">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Categories
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Moderators control which categories appear in the public blog filter
            and inside the author&apos;s category dropdown.
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
                    No categories yet. Create one so authors can assign blogs to
                    it.
                  </div>
                )}
              </div>
            )}
          </Await>
        </Suspense>
      )}
    </section>
  );
}
