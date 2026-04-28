import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  items: DropdownItem[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  /**
   * Additional className(s) applied to the trigger button.
   * Default styling in the forum uses:
   * "inline-flex items-center gap-2 px-2 text-sm font-semibold text-[#0050d4] hover:text-[#0046bd]"
   */
  buttonClassName?: string;
  /**
   * Alignment for the dropdown content. Matches the DropdownMenuContent `align` prop.
   */
  align?: "start" | "end" | "center";
  /**
   * Whether to show the chevron icon in the trigger button.
   */
  showChevron?: boolean;
  /**
   * Optional aria label for accessibility.
   */
  ariaLabel?: string;
}

/**
 * Reusable dropdown select used in the forum feature.
 *
 * - Renders a trigger button showing the label of the currently selected item (or the first item).
 * - Highlights the currently selected item in the dropdown list.
 */
export default function DropdownSelect({
  items,
  selectedValue,
  onSelect,
  buttonClassName = "inline-flex items-center gap-2 px-2 text-sm font-semibold text-[#0050d4] hover:text-[#0046bd]",
  align = "end",
  showChevron = true,
  ariaLabel,
}: DropdownSelectProps) {
  const label =
    items.find((i) => i.value === selectedValue)?.label ??
    items[0]?.label ??
    "";

  // Defensive: if there are no items, render a disabled button to avoid breaking the UI
  if (items.length === 0) {
    return (
      <Button
        type="button"
        variant="ghost"
        className={buttonClassName}
        disabled
      >
        {label}
        {showChevron && <ChevronDown className="ml-2 size-3" />}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={buttonClassName}
          aria-label={ariaLabel}
        >
          {label}
          {showChevron && <ChevronDown className="ml-2 size-3" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {items.map((item) => (
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
