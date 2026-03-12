import {
  Hash,
  Clock,
  Heart,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

interface Category {
  name: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { name: "All Categories", count: 4 },
  { name: "Business Growth", count: 1 },
  { name: "Career Advice", count: 0 },
  { name: "Tech & Innovation", count: 2 },
  { name: "Khmer Culture", count: 0 },
  { name: "Networking", count: 1 },
];

export const TRENDING_TOPICS = [
  "#ImpactKhmerLaunchpad",
  "#RealEstateTrendsPP",
  "#VCFundinginSEA",
  "#Agri-TechOpportunities",
  "#DigitalNomadLife",
];

interface CategoriesProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

function Categories({
  selectedCategory = "All Categories",
  onCategorySelect,
}: CategoriesProps) {
  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-bold text-lg leading-[27px] text-[#344256]">
          Categories
        </h3>
      </div>

      {/* Category buttons */}
      <div className="flex flex-col gap-[3.5px]">
        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect?.(category.name)}
            className={`flex h-9 items-center justify-between px-2.25 py-0 rounded-lg transition-colors ${
              selectedCategory === category.name
                ? "bg-transparent"
                : "hover:bg-[#f8fafc]"
            }`}
          >
            <span
              className={`text-sm font-semibold text-center tracking-tight ${
                selectedCategory === category.name
                  ? "text-[#2f6fe4]"
                  : "text-[#4a5565]"
              }`}
            >
              {category.name}
            </span>
            <span
              className={`h-[18.5px] rounded-lg px-1.5 text-xs font-semibold text-center flex items-center justify-center ${
                selectedCategory === category.name
                  ? "bg-[#2f6fe4] text-white"
                  : "bg-[#f3f4f6] text-[#99a1af]"
              }`}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TrendingTopics() {
  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-6 h-6 text-[#344256]" />
        <h3 className="font-bold text-lg leading-[27px] text-[#344256]">
          Trending Topics
        </h3>
      </div>

      {/* Topics grid */}
      <div className="flex flex-col gap-[7px]">
        {TRENDING_TOPICS.map((topic, index) => (
          <div
            key={index}
            className={`flex gap-[7px] flex-wrap ${index % 2 === 0 ? "" : ""}`}
          >
            <button
              className="bg-[#f8fafc] rounded-2xl px-1.5 py-1 hover:bg-[#f1f5f9] transition-colors"
              title={topic}
            >
              <span className="text-xs font-medium text-[#344256]">
                {topic}
              </span>
            </button>
            {index < TRENDING_TOPICS.length - 1 &&
              (index + 1) % 2 === 0 &&
              TRENDING_TOPICS[index + 1] && (
                <button
                  className="bg-[#f8fafc] rounded-2xl px-1.5 py-1 hover:bg-[#f1f5f9] transition-colors"
                  title={TRENDING_TOPICS[index + 1]}
                >
                  <span className="text-xs font-medium text-[#344256]">
                    {TRENDING_TOPICS[index + 1]}
                  </span>
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ForumSidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export default function ForumSidebar({
  selectedCategory,
  onCategorySelect,
}: ForumSidebarProps) {
  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <Categories
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
      />
      <TrendingTopics />
    </div>
  );
}
