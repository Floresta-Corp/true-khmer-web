import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { QuestionSortBy } from "~/features/forum/types";

interface QuestionSortByDropdownProps {
  selectedValue: QuestionSortBy;
  onSelect: (value: QuestionSortBy) => void;
}

const sortByItems: Array<{ label: string; value: QuestionSortBy }> = [
  { label: "Newest", value: "newest" },
  { label: "Most relevant", value: "mostRelevant" },
  { label: "Oldest", value: "oldest" },
  { label: "Most voted", value: "mostVoted" },
  { label: "Most answered", value: "mostAnswered" },
];

export default function QuestionSortByDropdown({
  selectedValue,
  onSelect,
}: QuestionSortByDropdownProps) {
  const label =
    sortByItems.find((i) => i.value === selectedValue)?.label ??
    sortByItems[0]?.label ??
    "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="inline-flex items-center gap-1 px-2 text-xs font-semibold text-[#0050d4] hover:text-[#0046bd] sm:max-w-none sm:gap-2 sm:text-sm"
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="ml-1 size-3 shrink-0 sm:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex min-w-46 flex-col gap-1 md:min-w-64"
      >
        {sortByItems.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onSelect={() => onSelect(item.value)}
            className={
              selectedValue === item.value ? "font-semibold text-[#1c5dd4]" : ""
            }
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
