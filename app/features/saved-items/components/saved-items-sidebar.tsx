import {
  Bookmark,
  MessageSquare,
  Calendar,
  HandHeart,
  Briefcase,
} from "lucide-react";
import type { FilterId } from "./saved-item-filter";
import SavedItemsFilter from "./saved-item-filter";

const FILTERS = [
  { id: "all" as const, label: "All", icon: Bookmark },
  { id: "forum" as const, label: "Forum", icon: MessageSquare },
  { id: "event" as const, label: "Events", icon: Calendar },
  { id: "volunteer" as const, label: "Volunteer", icon: HandHeart },
  { id: "launchpad" as const, label: "Launchpad", icon: Briefcase },
];

interface SavedSidebarProps {
  activeFilter: FilterId;
  onFilterChange: (id: FilterId) => void;
  counts: Record<FilterId, number>;
}

export default function SavedItemsSidebar({
  activeFilter,
  onFilterChange,
  counts,
}: SavedSidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-24">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">
            Saved Items
          </h2>
        </div>

        <div>
          <h3 className="px-3 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Types
          </h3>
          <div className="space-y-1">
            {FILTERS.map((filter) => (
              <SavedItemsFilter
                key={filter.id}
                {...filter}
                count={counts[filter.id]}
                isActive={activeFilter === filter.id}
                onClick={onFilterChange}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
