import { motion } from "motion/react";
import { useCallback } from "react";
import { useSearchParams } from "react-router";
import { SingleSelectDropdown } from "~/components/ui/single-select-dropdown";
import ApplicationStatusTabFilter from "../tab/application-status-tab-filter";

type TypeFilter = "all" | "volunteer" | "projects";

const isTypeFilter = (value: string | null): value is TypeFilter =>
  value === "all" || value === "volunteer" || value === "projects";

const typeFilterOptions = [
  { value: "all", label: "All Types" },
  { value: "volunteer", label: "Volunteer" },
  { value: "projects", label: "Projects" },
] satisfies { value: TypeFilter; label: string }[];

export default function MyApplicationMainContentHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeType: TypeFilter = isTypeFilter(tabParam) ? tabParam : "all";

  const handleTypeChange = useCallback(
    (value: TypeFilter) => {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          nextParams.set("tab", value);
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between"
    >
      <ApplicationStatusTabFilter />

      <div className="w-full md:w-[220px]">
        <SingleSelectDropdown
          id="my-application-type-filter"
          value={activeType}
          onValueChange={(value) => handleTypeChange(value as TypeFilter)}
          options={typeFilterOptions}
          placeholder="All Types"
          triggerClassName="h-12 rounded-2xl border-[#DADCE0] bg-white px-4 text-sm font-bold text-slate-800 shadow-none hover:border-[#BDC1C6] data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          contentClassName="rounded-2xl"
        />
      </div>
    </motion.div>
  );
}
