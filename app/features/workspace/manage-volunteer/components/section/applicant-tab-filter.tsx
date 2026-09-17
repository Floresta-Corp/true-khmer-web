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
  { label: "Confirmed", value: "confirmed" },
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
    <div className="-mx-4 no-scrollbar w-full overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="relative isolate flex w-max min-w-max gap-1 rounded-xl bg-slate-100 p-1 shadow-inner dark:bg-slate-900">
        {FILTER.map((filter) => {
          const isActive = activeType === filter.value;

          return (
            <button
              key={filter.value}
              onClick={() => handleTypeChange(filter.value)}
              className={cn(
                "relative isolate cursor-pointer rounded-lg px-4 py-1.5 text-[14px] font-bold whitespace-nowrap transition-colors duration-300 sm:px-5",
                isActive
                  ? "text-blue-600 dark:text-white"
                  : "text-gray-500 hover:text-slate-800",
              )}
            >
              <span className="relative z-20">{filter.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 z-10 rounded-lg bg-white shadow-sm dark:bg-slate-800"
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
