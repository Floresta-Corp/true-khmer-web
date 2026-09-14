import { Eye, EyeOff, MoreHorizontal, Pencil, Tags } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatDate } from "~/lib/time";
import type { BlogCategoryWithUsageResponse } from "~/types/api-client";

interface BlogCategoryRowProps {
  category: BlogCategoryWithUsageResponse;
  index: number;
  isSubmitting: boolean;
  onEdit: (category: BlogCategoryWithUsageResponse) => void;
  onToggleVisibility: (category: BlogCategoryWithUsageResponse) => void;
}

export function BlogCategoryRow({
  category,
  index,
  isSubmitting,
  onEdit,
  onToggleVisibility,
}: BlogCategoryRowProps) {
  return (
    <tr className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
      <td className="px-5 py-4 text-sm text-slate-500 sm:px-6 dark:text-slate-400">
        {index + 1}
      </td>
      <td className="px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <Tags className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {category.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {category.slug}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
        {category.postCount.toLocaleString()}
      </td>
      <td className="px-4 py-4">
        <Badge
          variant="outline"
          className={
            category.isVisible
              ? "gap-1.5 rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "gap-1.5 rounded-full border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }
        >
          <span
            className={`size-1.5 rounded-full ${category.isVisible ? "bg-emerald-500" : "bg-slate-400"}`}
          />
          {category.isVisible ? "Visible" : "Hidden"}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
        {formatDate(category.updatedAt) || "—"}
      </td>
      <td className="px-5 py-4 text-right sm:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Manage ${category.name}`}
              disabled={isSubmitting}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onSelect={() => onEdit(category)}>
              <Pencil />
              Edit category
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onToggleVisibility(category)}>
              {category.isVisible ? <EyeOff /> : <Eye />}
              {category.isVisible ? "Hide category" : "Show category"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
