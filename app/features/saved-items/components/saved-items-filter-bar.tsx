import {
  Bookmark,
  Briefcase,
  CalendarDays,
  GraduationCap,
  HandHeart,
  MessageSquare,
} from "lucide-react";
import { cn } from "~/lib/utils";
import type { FilterId } from "../types";

const FILTERS = [
  { id: "all" as const, label: "All", icon: Bookmark },
  { id: "forum" as const, label: "Forums", icon: MessageSquare },
  { id: "volunteer" as const, label: "Volunteers", icon: HandHeart },
  { id: "project" as const, label: "Projects", icon: Briefcase },
  { id: "course" as const, label: "Courses", icon: GraduationCap },
  { id: "event" as const, label: "Events", icon: CalendarDays },
];

interface SavedItemsFilterBarProps {
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
}

export default function SavedItemsFilterBar({
  activeFilter,
  onFilterChange,
}: SavedItemsFilterBarProps) {
  return (
    <div className="scrollbar-hide flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-slate-200 p-1.5">
      {FILTERS.map(({ id, label, icon: Icon }) => {
        const isActive = activeFilter === id;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(id)}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-all",
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-800",
            )}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
