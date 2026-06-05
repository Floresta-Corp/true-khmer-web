import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { QuestionSortBy } from "~/services/forum/forum-types";

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
          className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-[#0050d4] hover:text-[#0046bd]"
        >
          {label}
          <ChevronDown className="ml-2 size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
