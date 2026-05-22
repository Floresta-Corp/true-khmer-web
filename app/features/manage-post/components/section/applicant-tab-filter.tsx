import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";

type FilterType =
  | "all"
  | "new"
  | "in_review"
  | "approved"
  | "confirmed"
  | "declined";

const FILTER = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "In Review", value: "in_review" },
  { label: "Approved", value: "approved" },
  { label: "Declined", value: "declined" },
];

const VALID_FILTER = [
  "all",
  "new",
  "in_review",
  "approved",
  "confirmed",
  "declined",
] as const;

function isValidFilter(value: string | null): value is FilterType {
  return value !== null && VALID_FILTER.includes(value as FilterType);
}

export default function ApplicantTabRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawType = searchParams.get("filter");
  const activeType = isValidFilter(rawType) ? rawType : "all";

  const handleTypeChange = (range: string) => {
    const params = new URLSearchParams(searchParams);
    if (!range || range === "all") {
      params.delete("filter");
    } else {
      params.set("filter", range);
    }
    setSearchParams(params, { replace: true });
  };

  return (
    /* Handles horizontal swipe overflow on mobile without clipping shadows */
    <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner w-max relative isolate min-w-max">
        {FILTER.map((filter) => {
          const isActive = activeType === filter.value;

          return (
            <button
              key={filter.value}
              onClick={() => handleTypeChange(filter.value)}
              className={cn(
                "relative px-4 sm:px-5 py-1.5 text-[14px] font-bold transition-colors duration-300 cursor-pointer isolate rounded-lg whitespace-nowrap",
                isActive
                  ? "text-blue-600 dark:text-white"
                  : "text-gray-500 hover:text-slate-800",
              )}
            >
              <span className="relative z-20">{filter.label}</span>

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
  );
}
