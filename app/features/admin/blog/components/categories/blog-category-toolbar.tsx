import { Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface BlogCategoryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
}

export function BlogCategoryToolbar({
  search,
  onSearchChange,
  onCreate,
}: BlogCategoryToolbarProps) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl dark:text-white">
          Categories
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Create, edit, and control the categories shown in the public blog
          filter and the author&apos;s category dropdown.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
        <div className="relative min-w-0 sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            maxLength={120}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
            className="h-10 bg-white pr-3 pl-9 dark:border-slate-700 dark:bg-slate-950/60"
          />
        </div>
        <Button
          type="button"
          onClick={onCreate}
          className="h-10 bg-blue-600 px-4 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
        >
          <Plus className="size-4" />
          Create category
        </Button>
      </div>
    </div>
  );
}
