import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  DIFFICULTY_OPTIONS,
  type CourseDifficulty,
} from "~/features/course-builder/types";

const BAR_HEIGHTS = ["h-[5px]", "h-[8px]", "h-[11px]"];

/** The same bar meter a course card uses, so the level reads consistently. */
function LevelBars({ filled, active }: { filled: number; active: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-end gap-[2px]" aria-hidden>
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={height}
          className={cn(
            "w-[3px] rounded-[1px]",
            height,
            index < filled
              ? active
                ? "bg-[#1C5DD4]"
                : "bg-[#6B7280]"
              : "bg-[#D1D5DB]",
          )}
        />
      ))}
    </span>
  );
}

interface DifficultyCardsProps {
  value: CourseDifficulty | null;
  onChange: (value: CourseDifficulty) => void;
}

export function DifficultyCards({ value, onChange }: DifficultyCardsProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {DIFFICULTY_OPTIONS.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative cursor-pointer rounded-xl border px-3.5 py-3.5 text-left transition-colors",
              selected
                ? "border-[#1C5DD4] bg-[#F4F8FF]"
                : "border-[#E5E7EB] bg-white hover:border-[#ACC5F4]",
            )}
          >
            <span
              className={cn(
                "absolute top-2.5 right-2.5 flex size-4 items-center justify-center rounded-full bg-[#1C5DD4] text-white",
                selected ? "flex" : "hidden",
              )}
            >
              <Check size={10} strokeWidth={3} aria-hidden />
            </span>

            <span className="flex items-center gap-2.5">
              <LevelBars filled={option.bars} active={selected} />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-[#1A1A2E]">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[12.5px] text-[#9A9AB0]">
                  {option.desc}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
