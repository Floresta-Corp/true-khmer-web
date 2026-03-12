import { Users, Wrench, Palette, MessageCircle, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryConfig {
  label: string;
  displayName: string;
  icon: LucideIcon;
  color: string;
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    label: "FESTIVAL",
    displayName: "Festival",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "EXHIBITION",
    displayName: "Exhibition",
    icon: Palette,
    color: "text-teal-600 bg-teal-50",
  },
  {
    label: "CONCERT",
    displayName: "Concert",
    icon: MessageCircle,
    color: "text-pink-600 bg-pink-50",
  },
  {
    label: "WORKSHOP",
    displayName: "Workshop",
    icon: Wrench,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "CONFERENCE",
    displayName: "Conference",
    icon: Compass,
    color: "text-indigo-600 bg-indigo-50",
  },
];

interface CategoryFilterProps {
  categoryCounts: Record<string, number>;
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({
  categoryCounts,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <section className="pb-12 bg-blue-50 w-screen">
      <div className=" mx-[131.5px] py-17.5">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Browse by categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Explore events based on your interests and career goals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {CATEGORY_CONFIG.map((cat) => {
            const count = categoryCounts[cat.label] || 0;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => onCategoryChange(isActive ? null : cat.label)}
                className={`flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-200 hover:shadow-sm"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isActive ? "bg-white/20" : cat.color
                  }`}
                >
                  <cat.icon className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <div className="font-semibold leading-tight">
                    {cat.displayName}
                  </div>
                  <div
                    className={`text-[11px] leading-tight ${isActive ? "text-blue-100" : "text-gray-400"}`}
                  >
                    {count} {count === 1 ? "event" : "events"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
