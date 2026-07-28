import { useEffect, useRef, useState } from "react";
import { Check, ListFilter, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { CategoryOption } from "../types";
import { Input } from "~/components/ui/input";
import { debounce } from "~/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

export const STATUSES = [
  { label: "All Reports", value: "all" },
  { label: "Open", value: "open" },
  { label: "Resolved", value: "closed" },
] as const;

interface FilterBarProps {
  categoryOptions: CategoryOption[];
  selectedTypeId: string | null;
  onCategoryChange: (typeId: string | null) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  /** Committed search term from the URL. */
  searchValue: string;
  /** Called with the debounced search term. */
  onSearchChange: (value: string) => void;
}

function getStatusColor(isActive: boolean): string {
  return isActive
    ? "bg-blue-600/70 text-white"
    : "text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/40 dark:hover:text-white";
}

export function FilterBar({
  categoryOptions,
  selectedTypeId,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  searchValue,
  onSearchChange,
}: FilterBarProps) {
  const selectedLabel =
    selectedTypeId === null
      ? "All Types"
      : (categoryOptions.find((o) => o.id === selectedTypeId)?.name ??
        "Select Type…");

  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchValue);

  // Keep the input in sync when the URL changes elsewhere (back/forward, reset).
  useEffect(() => {
    setSearchInput(searchValue);
  }, [searchValue]);

  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  const debouncedSearchRef = useRef(
    debounce((value: string) => {
      onSearchChangeRef.current(value);
    }, SEARCH_DEBOUNCE_MS),
  );
  useEffect(() => {
    return () => debouncedSearchRef.current.cancel();
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    debouncedSearchRef.current(value);
  };

  const handleSelect = (id: string | null) => {
    onCategoryChange(id);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-5 dark:border-slate-800">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
        <div className="flex h-10 items-center rounded-lg border border-slate-100 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          {STATUSES.map((status) => {
            const isActive = selectedStatus === status.value;
            return (
              <Button
                variant="ghost"
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`h-8 cursor-pointer rounded-md px-4 text-xs font-medium tracking-wide uppercase transition-all ${getStatusColor(
                  isActive,
                )}`}
              >
                {status.label}
              </Button>
            );
          })}
        </div>
        <div className="md:ml-auto">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-100 bg-white px-4 text-sm font-medium text-slate-900 transition-all hover:border-blue-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100">
                <ListFilter size={14} className="opacity-40" />
                {selectedLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="max-h-72 min-w-56 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              {categoryOptions.map((option) => {
                const isSelected = selectedTypeId === option.id;
                return (
                  <button
                    key={option.id ?? "__all__"}
                    onClick={() => handleSelect(option.id)}
                    className={`relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none ${
                      isSelected
                        ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        : "font-normal text-slate-700 hover:bg-slate-100 focus:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-2 flex size-3.5 items-center justify-center">
                        <Check size={14} />
                      </span>
                    )}
                    {option.name}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative min-w-0 flex-1 sm:w-63 sm:flex-none md:w-72">
          <Search
            size={16}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <Input
            type="search"
            aria-label="Search reports"
            maxLength={100}
            className="h-10 rounded-xl border-slate-200 bg-white pr-4 pl-11 text-[14px] text-slate-900 transition-all placeholder:font-medium placeholder:text-slate-400 focus-visible:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Search report..."
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
