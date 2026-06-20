import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { CategoryOption } from "./pages/content-moderator-page";

export const STATUSES = [
  { label: "All", value: "all", color: "slate" },
  { label: "Open", value: "open", color: "emerald" },
  { label: "Closed", value: "closed", color: "rose" },
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
    <div className=" py-6 dark:border-slate-800 flex flex-wrap items-center ">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="flex items-center gap-4 px-6 py-5 rounded-xl text-[13px] font-semibold bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 hover:border-blue-500 transition-all cursor-pointer">
              {selectedLabel}
              <ChevronDown
                size={14}
                className={`opacity-40 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="min-w-56 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 p-1.5"
          >
            {categoryOptions.map((option) => {
              const isSelected = selectedTypeId === option.id;
              return (
                <Button
                  variant="ghost"
                  key={option.id ?? "__all__"}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full justify-between text-left px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{option.name}</span>
                  {isSelected && (
                    <Check
                      size={14}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  )}
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>

        <div className="flex p-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
          {STATUSES.map((status) => {
            const isActive = selectedStatus === status.value;
            return (
              <Button
                variant="ghost"
                key={status.value}
                onClick={() => onStatusChange(status.value)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest cursor-pointer transition-all ${getStatusColor(
                  status.color,
                  isActive,
                )}`}
              >
                {status.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
