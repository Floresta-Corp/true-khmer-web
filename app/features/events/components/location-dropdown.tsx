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
          className="h-auto px-3 py-2 flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
        >
          <span>{value}</span>
          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-40 max-h-60 overflow-y-auto"
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
              className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                value === opt
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {value === opt && (
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              )}
            </span>
            <span className={value === opt ? "font-semibold" : ""}>{opt}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
