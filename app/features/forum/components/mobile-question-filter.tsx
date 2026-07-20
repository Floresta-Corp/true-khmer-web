import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { ForumQuestionTab } from "./sections/forum-content-new";

interface MobileQuestionFilterProps {
  activeTab: ForumQuestionTab;
  onTabChange: (tab: ForumQuestionTab) => void;
}

const tabItems: Array<{ label: string; value: ForumQuestionTab }> = [
  { label: "All", value: "recent" },
  { label: "Trending", value: "topRated" },
  { label: "Unanswered", value: "unanswered" },
];

export default function MobileQuestionFilter({
  activeTab,
  onTabChange,
}: MobileQuestionFilterProps) {
  const label =
    tabItems.find((t) => t.value === activeTab)?.label ?? tabItems[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="ml-1 size-3 shrink-0 sm:ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="flex min-w-46 flex-col gap-1 md:min-w-64"
      >
        {tabItems.map((tab) => (
          <DropdownMenuItem
            key={tab.value}
            onSelect={() => onTabChange(tab.value)}
            className={
              activeTab === tab.value ? "font-semibold text-[#1c5dd4]" : ""
            }
          >
            {tab.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
