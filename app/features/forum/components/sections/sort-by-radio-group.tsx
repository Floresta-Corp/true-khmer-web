import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";

const sortByOptions = [
  { label: "Most relevant", value: "mostRelevant" },
  { label: "Most recent", value: "newest" },
  { label: "Least recent", value: "oldest" },
  { label: "All time", value: "mostVoted" },
];

interface SortByRadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function SortByRadioGroup({
  value,
  onValueChange,
}: SortByRadioGroupProps) {
  return (
    <div className="mt-5 space-y-3">
      <p className="text-[12.25px] leading-[17.5px] font-semibold text-[#2c2f31]">
        Sort by
      </p>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="space-y-1.5"
      >
        {sortByOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 text-[12.25px] leading-[17.5px] text-[#595c5e] cursor-pointer"
          >
            <RadioGroupItem
              value={option.value}
              className="border-[#e8e8e8]"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}