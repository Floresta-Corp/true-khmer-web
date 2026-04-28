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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full px-4 py-2.5 text-sm">
          {tabItems.find((t) => t.value === activeTab)?.label ??
            tabItems[0].label}
          <ChevronDown className="ml-2 size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
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
