import { useState, useRef, useEffect } from "react";
import { Funnel, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";
import type { CategoriesPicker } from "~/features/forum/types";
import SortByRadioGroup from "./sort-by-radio-group";
import { useSearchParams } from "react-router";

interface SearchFiltersSidebarProps {
  search: string;
  categories: CategoriesPicker[];
  sortBy?: string;
  categoryId?: string;
  onClearSearch?: () => void;
  onClearSearchValue?: () => void;
  onSortChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
}

export default function SearchFiltersSidebar({
  search,
  categories,
  sortBy,
  categoryId,
  onClearSearch,
  onClearSearchValue,
  onSortChange,
  onCategoryChange,
}: SearchFiltersSidebarProps) {
  const prefersReducedMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortValue, setSortValue] = useState(sortBy || "mostRelevant");
  const [categoryValue, setCategoryValue] = useState(
    categoryId || "all-categories",
  );
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  const allCategories = [
    { id: "all-categories", name: "All Categories" },
    ...categories,
  ];

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange?.(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryValue(value);
    onCategoryChange?.(value);
  };

  const handleClearAll = () => {
    setSortValue("mostRelevant");
    setCategoryValue("all-categories");
    onClearSearch?.();
    onClearSearchValue?.();
    onSortChange?.("mostRelevant");
    onCategoryChange?.("all-categories");
    setSearchParams({}, { replace: true, preventScrollReset: true });
  };

  return (
    <motion.aside
      className="w-full rounded-[14px] bg-white p-6 shadow-[0px_0px_6px_0px_rgba(0,0,0,0.02)] lg:w-80 lg:shrink-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-bold text-[#2c2f31]">
          <Funnel className="size-3.5 text-[#2f6fe4]" />
          Filters
        </h3>
        <button
          type="button"
          className="text-[10.5px] font-semibold tracking-[0.0923px] text-[#0050d4]"
          onClick={handleClearAll}
        >
          Clear all
        </button>
      </div>

      <div className="my-3 h-px w-full bg-[#edf2f7]" />

      {search.trim() && (
        <div className="rounded-lg bg-[#eef2ff] px-2.5 py-2 text-[12.25px] leading-[17.5px] text-[#2c2f31]">
          <div className="flex items-center justify-between gap-2">
            <span>{`Search: "${search}"`}</span>
            <button
              type="button"
              aria-label="Clear search"
              className="text-[#5f6b7c]"
              onClick={onClearSearch}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <SortByRadioGroup value={sortValue} onValueChange={handleSortChange} />

      <div className="my-4 h-px w-full bg-[#edf2f7]" />

      <div className="space-y-3">
        <p className="text-[12.25px] leading-[17.5px] font-semibold text-[#2c2f31]">
          By category
        </p>
        <RadioGroup
          value={categoryValue}
          onValueChange={handleCategoryChange}
          className="space-y-2"
        >
          {allCategories.map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-2.5 text-[12.25px] leading-[17.5px] text-[#595c5e] cursor-pointer"
            >
              <RadioGroupItem value={option.id} className="border-[#e8e8e8]" />
              <span>{option.name}</span>
            </label>
          ))}
        </RadioGroup>
      </div>
    </motion.aside>
  );
}
