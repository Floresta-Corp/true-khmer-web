import { Card } from "~/components/ui/card";
import type { BlogCategoryWithUsageResponse } from "~/types/api-client";
import { BlogCategoryFormDialog } from "./categories/blog-category-form-dialog";
import { BlogCategoryStats } from "./categories/blog-category-stats";
import { BlogCategoryTable } from "./categories/blog-category-table";
import { BlogCategoryToolbar } from "./categories/blog-category-toolbar";
import { useBlogCategoryManager } from "./categories/use-blog-category-manager";

export function BlogCategoryManager({
  categories,
  initialSearch,
}: {
  categories: BlogCategoryWithUsageResponse[];
  initialSearch: string;
}) {
  const manager = useBlogCategoryManager(categories, initialSearch);

  return (
    <>
      <Card className="flex h-[clamp(32rem,calc(100dvh-19rem),48rem)] flex-col overflow-hidden rounded-2xl border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="p-4 sm:p-6">
          <BlogCategoryToolbar
            search={manager.search}
            onSearchChange={manager.setSearch}
            onCreate={manager.openCreateDialog}
          />
          <BlogCategoryStats
            totalCount={categories.length}
            visibleCount={manager.visibleCount}
          />
        </div>

        <BlogCategoryTable
          categories={categories}
          totalCount={categories.length}
          hasSearch={Boolean(manager.search.trim())}
          isSubmitting={manager.isSubmitting}
          onEdit={manager.openEditDialog}
          onToggleVisibility={manager.toggleVisibility}
        />
      </Card>

      <BlogCategoryFormDialog
        isOpen={Boolean(manager.dialog)}
        mode={manager.dialog?.mode ?? "create"}
        name={manager.dialog?.name ?? ""}
        isSubmitting={manager.isSubmitting}
        onNameChange={manager.setDialogName}
        onClose={manager.closeDialog}
        onSubmit={manager.submitDialog}
      />
    </>
  );
}
