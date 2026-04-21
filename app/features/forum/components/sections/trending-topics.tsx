import { Hash } from "lucide-react";
import { Toggle } from "~/components/ui/toggle";
import type { Tag } from "~/services/forum/forum-types";

interface TrendingTopicsProps {
  tags?: Tag[] | undefined;
  selectedTagId?: string;
  onTagSelect?: (tag: Tag) => void;
}

export default function TrendingTopics({
  tags,
  selectedTagId,
  onTagSelect,
}: TrendingTopicsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-5 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Hash className="w-6 h-6 text-[#344256]" />
        <h3 className="font-bold text-lg leading-6.75 text-[#344256]">
          Trending Topics
        </h3>
      </div>

      {/* Topics badges */}
      <div className="flex flex-wrap gap-1.75">
        {tags.map((tag) => (
          <Toggle
            key={tag.id}
            pressed={selectedTagId === tag.id}
            onClick={() => onTagSelect?.(tag)}
            className={`inline-flex cursor-pointer rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${
              selectedTagId === tag.id
                ? "border-[#c7dcff] bg-[#eaf2ff] text-[#0050d4]"
                : "border-[#e1e7ef] bg-white text-[#65758b] hover:border-[#c7dcff] hover:text-[#0050d4]"
            }`}
            title={tag.name}
          >
            #{tag.name}
          </Toggle>
        ))}
      </div>
    </div>
  );
}
