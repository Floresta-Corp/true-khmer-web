import { TrendingUp } from "lucide-react";
import { Card } from "~/components/ui/card";
import type { TrendingTagResponse } from "~/types/api-client";

interface TrendingTopicsProps {
  tags?: TrendingTagResponse[] | undefined;
  selectedTagId?: string;
  onTagSelect?: (tag: TrendingTagResponse) => void;
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
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
    <Card className="w-full rounded-2xl border-none bg-white p-5 shadow-none">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm leading-6.75 font-medium text-[#344256]">
          Trending Topics
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect?.(tag)}
            aria-pressed={selectedTagId === tag.id}
            className="group flex w-full items-center justify-between text-left"
          >
            <span
              className={`inline-flex cursor-pointer items-center rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                selectedTagId === tag.id
                  ? "bg-[#eaf2ff] text-[#0050d4]"
                  : "bg-[#f1f5f9] text-[#344256] group-hover:bg-[#eaf2ff] group-hover:text-[#0050d4]"
              }`}
            >
              #{tag.name}
            </span>
            <span className="text-xs text-[#65758b]">
              {formatCount(tag.count)} posts
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
