import { useMemo } from "react";

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
};

export function InterestSelector({
  interests,
  selectedIds,
  onToggle,
  chunkSize = 4,
}: InterestSelectorProps) {
  const rows = useMemo(() => {
    const result: Array<InterestItem[]> = [];
    for (let i = 0; i < interests.length; i += chunkSize) {
      result.push(interests.slice(i, i + chunkSize));
    }
    return result;
  }, [chunkSize, interests]);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="inline-flex w-full flex-wrap items-start gap-2">
          {row.map((interest) => {
            const isActive = selectedIds.includes(interest.id);
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => onToggle(interest.id)}
                className={`inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[999px] border px-3 text-sm font-medium leading-5 ${
                  isActive
                    ? "bg-[#EAF2FF] border-[#9FC4F8] text-[#1D4DB4]"
                    : "bg-white border-[#E2E8F0] text-[#0F172B]"
                }`}
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {interest.icon}
                </span>
                <span>{interest.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
