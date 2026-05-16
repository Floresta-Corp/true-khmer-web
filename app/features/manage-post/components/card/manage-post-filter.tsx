import { useSearchParams, useFetcher, useLoaderData } from "react-router";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";

type TabType = "all" | "projects" | "volunteer";

const TABS = [
  { label: "All", value: "all" },
  { label: "Volunteer", value: "volunteer" },
  { label: "Projects", value: "projects" },
];

const VALID_TABS = ["all", "volunteer", "projects"] as const;

function isValidTab(value: string | null): value is TabType {
  return value !== null && VALID_TABS.includes(value as TabType);
}

const VALID_STATUS_VALUES = [
  "all",
  "active",
  "draft",
  "filled",
  "ended",
] as const;

function isValidStatus(
  value: string | null,
): value is (typeof VALID_STATUS_VALUES)[number] {
  return (
    value !== null &&
    VALID_STATUS_VALUES.includes(value as (typeof VALID_STATUS_VALUES)[number])
  );
}

export default function ManagePostFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawType = searchParams.get("type");
  const activeType = isValidTab(rawType) ? rawType : "all";
  const rawFilter = searchParams.get("filter");
  const filter = isValidStatus(rawFilter) ? rawFilter : "all";
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (!type || type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    setSearchParams(params, { replace: true });
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap w-full m-4">
      <div className="flex items-center gap-3">
        <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner sm:w-max">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTypeChange(tab.value)}
              className="relative px-5 py-1.5 text-[14px] font-bold transition-colors duration-300 cursor-pointer z-10"
            >
              <span
                className={cn(
                  "relative z-20",
                  activeType === tab.value
                    ? "text-blue-600 dark:text-white"
                    : "text-gray-500",
                )}
              >
                {tab.label}
              </span>

              {activeType === tab.value && (
                <motion.div
                  layoutId="applicantsActiveTab"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <Select value={filter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-35 h-10 text-[14px] font-medium border-slate-200 bg-white rounded-xl focus:ring-blue-500/20">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="filled">Filled</SelectItem>
            <SelectItem value="ended">Ended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative flex-1 max-w-md min-w-70">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          className="h-10 pl-11 pr-4 text-[14px] border-slate-200 bg-white rounded-xl focus-visible:ring-blue-500/20 placeholder:text-slate-400 placeholder:font-medium transition-all"
          placeholder="Search postings name..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
