import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

export interface TabItem<T extends string> {
  label: string;
  value: T;
}

export interface TabGroupProps<T extends string> {
  items: TabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export default function TabGroup<T extends string>({
  items,
  activeTab,
  onTabChange,
  className,
}: TabGroupProps<T>) {
  const activeLabel =
    items.find((t) => t.value === activeTab)?.label ?? items[0]?.label;

  return (
    <div className={className}>
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        {items.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={`${tab.label}-${tab.value}`}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={`cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#0050d4] text-[#f1f2ff]"
                  : "bg-[#eef1f3] text-[#595c5e] hover:bg-[#e2e8f0]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full px-4 py-2.5 text-sm"
            >
              {activeLabel}
              <ChevronDown className="ml-2 size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {items.map((tab) => (
              <DropdownMenuItem
                key={tab.value}
                onSelect={() => onTabChange(tab.value)}
              >
                {tab.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
