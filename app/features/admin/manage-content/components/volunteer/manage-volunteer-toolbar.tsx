import { useCallback } from "react";
import { useSearchParams } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ContentSearchField from "~/features/admin/components/content-search-field";
import {
  VOLUNTEER_STATUS_OPTIONS,
  toStatusParam,
} from "~/features/admin/manage-content/types";
import { cn } from "~/lib/utils";

export const ALL_CATEGORIES = "all-categories";
export const ALL_LOCATIONS = "all-locations";

export function readVolunteerFilters(searchParams: URLSearchParams) {
  return {
    categoryId: searchParams.get("categoryId") || ALL_CATEGORIES,
    locationId: searchParams.get("locationId") || ALL_LOCATIONS,
  };
}

type Option = { id: string; name: string };

type CategoryOption = Option & { count?: number };

interface ManageVolunteerToolbarProps {
  categories: CategoryOption[];
  locations: Option[];
  searchValue: string;
  statusValue: string;
  allValue: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function ManageVolunteerToolbar({
  categories,
  locations,
  searchValue,
  statusValue,
  allValue,
  onSearchChange,
  onStatusChange,
}: ManageVolunteerToolbarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { categoryId: categoryValue, locationId: locationValue } =
    readVolunteerFilters(searchParams);

  const updateFilter = useCallback(
    (key: "categoryId" | "locationId", value: string | null) => {
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

  const handleLocationChange = (value: string) =>
    updateFilter("locationId", value === ALL_LOCATIONS ? null : value);

  const categoryChips: CategoryOption[] = [
    {
      id: ALL_CATEGORIES,
      name: "All Categories",
      count: categories.reduce(
        (total, category) => total + (category.count ?? 0),
        0,
      ),
    },
    ...categories,
  ];

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
      <div
        role="group"
        aria-label="Filter by category"
        className="flex min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categoryChips.map((category) => {
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

      <div className="grid gap-2 border-t border-slate-100 pt-2 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] dark:border-slate-800">
        <ContentSearchField
          value={searchValue}
          placeholder="Search opportunities…"
          label="Search opportunities"
          onChange={onSearchChange}
        />

        <Select value={locationValue} onValueChange={handleLocationChange}>
          <SelectTrigger
            aria-label="Filter by location"
            className="h-10 cursor-pointer rounded-xl border-0 bg-transparent px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:w-44 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={ALL_LOCATIONS}>All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
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
          <SelectContent align="end">
            <SelectItem value={allValue}>All Status</SelectItem>
            {VOLUNTEER_STATUS_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={toStatusParam(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
