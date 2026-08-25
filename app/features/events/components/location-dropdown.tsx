import { ChevronDown, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "~/components/ui/dropdown-menu";

interface LocationDropdownProps {
  value: string;
  onChange: (val: string) => void;
  locations: string[];
}

export function LocationDropdown({
  value,
  onChange,
  locations,
}: LocationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap text-gray-700 transition-colors hover:text-gray-900"
        >
          <span>{value}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-60 min-w-40 overflow-y-auto"
      >
        <DropdownMenuLabel>Location</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locations.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center gap-2.5"
          >
            <span
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                value === opt
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300"
              }`}
            >
              {value === opt && (
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              )}
            </span>
            <span className={value === opt ? "font-semibold" : ""}>{opt}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
