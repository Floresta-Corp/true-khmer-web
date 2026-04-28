import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

export interface SortOption<T extends string> {
  label: string;
  value: T;
}

export interface SortDropdownProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SortOption<T>[];
  className?: string;
  triggerLabel?: string;
}

export default function SortDropdown<T extends string>({
  value,
  onChange,
  options,
  className,
  triggerLabel,
}: SortDropdownProps<T>) {
  const activeLabel =
    options.find((o) => o.value === value)?.label ??
    triggerLabel ??
    options[0]?.label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={className}>
          {activeLabel}
          <ChevronDown className="size-5 text-[#0050d4]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onChange(option.value)}
            className={
              option.value === value ? "bg-accent text-blue-600" : undefined
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
