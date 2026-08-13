import { useCallback } from "react";
import { ArrowDownWideNarrow } from "lucide-react";
import { useSearchParams } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  ALL_CATEGORIES,
  LAUNCHPAD_STATUS_OPTIONS,
  toStatusParam,
} from "~/features/admin/manage-content/types";
import { launchpadSortBySchema } from "~/features/launchpad/types";
import type { LaunchpadSortBy } from "~/features/launchpad/types";
import { cn } from "~/lib/utils";
import ContentSearchField from "~/features/admin/components/content-search-field";

export const ALL_CITIES = "all-cities";
const DEFAULT_SORT_BY: LaunchpadSortBy = "newest";

const SORT_OPTIONS: { value: LaunchpadSortBy; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "startingSoon", label: "Closing Soon" },
  { value: "mostSpotsAvailable", label: "Most Spots" },
];

export function readLaunchpadFilters(searchParams: URLSearchParams) {
  const parsedSortBy = launchpadSortBySchema.safeParse(
    searchParams.get("sortBy"),
  );

  return {
    categoryId: searchParams.get("categoryId") || ALL_CATEGORIES,
    cityId: searchParams.get("cityId") || ALL_CITIES,
    sortBy: parsedSortBy.success ? parsedSortBy.data : DEFAULT_SORT_BY,
  };
}

type Option = { id: string; name: string };

type CategoryOption = Option & { count?: number };

interface ManageLaunchpadToolbarProps {
  categories: CategoryOption[];
  cities: Option[];
  searchValue: string;
  statusValue: string;
  allValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ManageLaunchpadToolbar({
  categories,
  cities,
  searchValue,
  statusValue,
  allValue,
  onSearchChange,
  onStatusChange,
}: ManageLaunchpadToolbarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    categoryId: categoryValue,
    cityId: cityValue,
    sortBy: sortValue,
  } = readLaunchpadFilters(searchParams);

  const updateFilter = useCallback(
    (key: "categoryId" | "cityId" | "sortBy", value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          next.delete("cursor");
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const handleCategoryChange = (value: string) =>
    updateFilter("categoryId", value === ALL_CATEGORIES ? null : value);

  const handleCityChange = (value: string) =>
    updateFilter("cityId", value === ALL_CITIES ? null : value);

  const handleSortChange = (value: LaunchpadSortBy) =>
    updateFilter("sortBy", value === DEFAULT_SORT_BY ? null : value);

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const isActive = category.id === categoryValue;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex min-w-fit flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-sky-600 text-white dark:bg-sky-900 dark:text-slate-100"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
              )}
            >
              {category.name}
              {category.count !== undefined && (
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                    isActive
                      ? "bg-white/20 text-white dark:bg-sky-800/10 dark:text-slate-100"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                  )}
                >
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-2 border-t border-slate-100 pt-2 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] dark:border-slate-800">
        <ContentSearchField
          value={searchValue}
          placeholder="Search projects…"
          label="Search projects"
          onChange={onSearchChange}
        />

        <Select value={cityValue} onValueChange={handleCityChange}>
          <SelectTrigger
            aria-label="Filter by city"
            className="h-10 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:w-40 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_CITIES}>All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger
            aria-label="Filter by status"
            className="h-10 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:w-40 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={allValue}>All Status</SelectItem>
            {LAUNCHPAD_STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={toStatusParam(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortValue}
          onValueChange={(value) => handleSortChange(value as LaunchpadSortBy)}
        >
          <SelectTrigger
            aria-label="Sort projects"
            className="h-10 shrink-0 cursor-pointer gap-2 rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:w-44 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowDownWideNarrow
              size={15}
              className="shrink-0 text-slate-400"
            />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
