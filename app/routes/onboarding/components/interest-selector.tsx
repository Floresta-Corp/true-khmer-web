import { useMemo } from "react";
import { Button } from "~/components/ui/button";

type InterestItem = {
  id: string;
  label: string;
  icon?: string;
};

type InterestSelectorProps = {
  interests: InterestItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  chunkSize?: number;
  className?: string;
};

export function InterestSelector({
  interests,
  selectedIds,
  onToggle,
  chunkSize = 4,
  className,
}: InterestSelectorProps) {
  const rows = useMemo(() => {
    const result: Array<InterestItem[]> = [];
    for (let i = 0; i < interests.length; i += chunkSize) {
      result.push(interests.slice(i, i + chunkSize));
    }
    return result;
  }, [chunkSize, interests]);

  return (
    <div
      className={`flex w-full flex-col items-start gap-3 ${className ?? ""}`}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="inline-flex w-full flex-wrap items-start gap-2"
        >
          {row.map((interest) => {
            const isActive = selectedIds.includes(interest.id);
            return (
              <Button
                key={interest.id}
                type="button"
                onClick={() => onToggle(interest.id)}
                variant="outline"
                className={`h-8 shrink-0 cursor-pointer gap-1.5 whitespace-nowrap rounded-[999px] px-3 text-sm font-medium leading-5 ${
                  isActive
                    ? "border-[#D0E2FF] bg-[#EAF2FF] text-[#1D4DB4]"
                    : "border-[#F1F5F9] bg-white text-[#0F172B] hover:bg-white"
                }`}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {interest.icon}
                </span>
                <span>{interest.label}</span>
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
