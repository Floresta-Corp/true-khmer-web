import { useState } from "react";
import { Check, ChevronDown, ListFilter } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { CategoryOption } from "../types";

export const STATUSES = [
  { label: "All Reports", value: "all", color: "slate" },
  { label: "Open", value: "open", color: "emerald" },
  { label: "Resolved", value: "closed", color: "rose" },
] as const;

interface FilterBarProps {
  categoryOptions: CategoryOption[];
  selectedTypeId: string | null;
  onCategoryChange: (typeId: string | null) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

function getStatusColor(color: string, isActive: boolean): string {
  const colors: Record<string, string> = {
    slate: isActive
      ? "bg-blue-600/70 text-white"
      : "text-slate-400 hover:dark:text-white hover:bg-slate-50 hover:dark:bg-slate-500/50",
    rose: isActive
      ? "bg-rose-600/70 text-white"
      : "text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:dark:text-white hover:dark:bg-rose-500/40",
    emerald: isActive
      ? "bg-emerald-600/70 text-white"
      : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:dark:text-white hover:dark:bg-emerald-500/40 ",
  };

  return colors[color] ?? "text-slate-400";
}

export function FilterBar({
  categoryOptions,
  selectedTypeId,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: FilterBarProps) {
  const selectedLabel =
    selectedTypeId === null
      ? "All Types"
      : (categoryOptions.find((o) => o.id === selectedTypeId)?.name ??
        "Select Type…");

  const [open, setOpen] = useState(false);

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
                  status.color,
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
      </div>
    </div>
  );
}
