import { useState } from "react";
import { Card } from "~/components/ui/card";
import type { TrendingTagResponse } from "~/types/api-client";

interface TrendingTopicsProps {
  tags?: TrendingTagResponse[] | undefined;
  selectedTagId?: string;
  onTagSelect?: (tag: TrendingTagResponse) => void;
}

const COLLAPSED_COUNT = 3;

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
  const [showAll, setShowAll] = useState(false);

  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = showAll ? tags : tags.slice(0, COLLAPSED_COUNT);

  return (
    <Card className="w-full gap-0 rounded-2xl border border-[#e9eef5] bg-white p-5 shadow-none">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base leading-6 font-bold text-[#0f1729]">
          Trending Topics
        </h3>
        {tags.length > COLLAPSED_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="cursor-pointer text-xs font-semibold text-[#2f6fe4] transition-colors hover:text-[#1f62df]"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3.5">
        {visibleTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect?.(tag)}
            aria-pressed={selectedTagId === tag.id}
            className="group flex w-full cursor-pointer items-center justify-between gap-2 text-left"
          >
            <span
              className={`truncate text-sm font-semibold transition-colors ${
                selectedTagId === tag.id
                  ? "text-[#0050d4]"
                  : "text-[#2f6fe4] group-hover:text-[#0050d4]"
              }`}
            >
              #{tag.name}
            </span>
            <span className="shrink-0 text-xs text-[#9eacc0]">
              {formatCount(tag.count)} posts
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}
