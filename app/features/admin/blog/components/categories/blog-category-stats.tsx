import type { ReactNode } from "react";
import { Eye, EyeOff, FolderTree } from "lucide-react";

interface BlogCategoryStatsProps {
  totalCount: number;
  visibleCount: number;
}

export function BlogCategoryStats({
  totalCount,
  visibleCount,
}: BlogCategoryStatsProps) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      <CategoryStat
        icon={<FolderTree className="size-5" />}
        label="Total categories"
        value={totalCount}
        color="blue"
      />
      <CategoryStat
        icon={<Eye className="size-5" />}
        label="Visible"
        value={visibleCount}
        color="emerald"
      />
      <CategoryStat
        icon={<EyeOff className="size-5" />}
        label="Hidden"
        value={totalCount - visibleCount}
        color="slate"
      />
    </div>
  );
}

function CategoryStat({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: "blue" | "emerald" | "slate";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    slate: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xl font-bold text-slate-950 dark:text-white">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
