import { FolderTree } from "lucide-react";
import type { BlogCategoryWithUsageResponse } from "~/types/api-client";
import { BlogCategoryRow } from "./blog-category-row";

interface BlogCategoryTableProps {
  categories: BlogCategoryWithUsageResponse[];
  totalCount: number;
  isSubmitting: boolean;
  onEdit: (category: BlogCategoryWithUsageResponse) => void;
  onToggleVisibility: (category: BlogCategoryWithUsageResponse) => void;
}

export function BlogCategoryTable({
  categories,
  totalCount,
  isSubmitting,
  onEdit,
  onToggleVisibility,
}: BlogCategoryTableProps) {
  return (
    <div className="overflow-x-auto border-t border-slate-100 dark:border-slate-800">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead className="bg-slate-50/80 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:bg-slate-950/50 dark:text-slate-400">
          <tr>
            <th className="w-16 px-5 py-3.5 sm:px-6">#</th>
            <th className="px-4 py-3.5">Category</th>
            <th className="w-32 px-4 py-3.5">Articles</th>
            <th className="w-36 px-4 py-3.5">Visibility</th>
            <th className="w-44 px-4 py-3.5">Last updated</th>
            <th className="w-20 px-5 py-3.5 text-right sm:px-6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {categories.map((category, index) => (
            <BlogCategoryRow
              key={category.id}
              category={category}
              index={index}
              isSubmitting={isSubmitting}
              onEdit={onEdit}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </tbody>
      </table>

      {categories.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
          <FolderTree className="size-8 text-slate-300 dark:text-slate-600" />
          <p className="mt-3 font-semibold text-slate-900 dark:text-white">
            {totalCount === 0 ? "No categories yet" : "No matching categories"}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {totalCount === 0
              ? "Create a category so authors can organize their blogs."
              : "Try a different name or slug."}
          </p>
        </div>
      ) : null}
    </div>
  );
}
