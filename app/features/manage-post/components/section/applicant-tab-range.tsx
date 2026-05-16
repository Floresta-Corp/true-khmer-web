import { useState } from "react";
import { useSearchParams } from "react-router";
import type { Applicant } from "~/services/manage-post/types";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type RangeType = "today" | "this_week" | "all_time";

const RANGE = [
  { label: "Today", value: "today" },
  { label: "This week", value: "this_week" },
  { label: "All time", value: "all_time" },
];

const VALID_RANGE = ["today", "this_week", "all_time"] as const;
function isValidTab(value: string | null): value is RangeType {
  return value !== null && VALID_RANGE.includes(value as RangeType);
}

export default function ApplicantTabRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawType = searchParams.get("range");
  const activeType = isValidTab(rawType) ? rawType : "all_time";
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("range", type);
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
    <div className="flex items-center justify-between gap-4 flex-wrap p-8">
      {/* Left Side: Title and Tabs Group */}
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          All Applicants
        </h2>

        {/* Added 'isolate' to prevent internal layout elements from jumping context */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner w-max relative isolate">
          {RANGE.map((range) => {
            const isActive = activeType === range.value;

            return (
              <button
                key={range.value}
                onClick={() => handleTypeChange(range.value)}
                className={cn(
                  "relative px-5 py-1.5 text-[14px] font-bold transition-colors duration-300 cursor-pointer isolate rounded-lg",
                  isActive ? "text-blue-600 dark:text-white" : "text-gray-500",
                )}
              >
                <span className="relative z-20">{range.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm z-10"
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Side: Search Bar */}
      <div className="relative flex-1 max-w-md min-w-70">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <Input
          className="h-10 pl-11 pr-4 text-[13px] border-slate-200 bg-white rounded-xl focus-visible:ring-blue-500/20 placeholder:text-slate-400 placeholder:font-medium transition-all shadow-sm"
          placeholder="Search postings name"
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
