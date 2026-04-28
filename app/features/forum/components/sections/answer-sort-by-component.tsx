import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";

interface AnswerSortByComponentProps {
  defaultValue?: "Popular" | "Newest" | "Oldest";
  onChange?: (value: "Popular" | "Newest" | "Oldest") => void;
}

export default function AnswerSortByComponent({
  defaultValue = "Popular",
  onChange,
}: AnswerSortByComponentProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleSelect = (value: "Popular" | "Newest" | "Oldest") => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"default"}
          type="button"
          className="inline-flex bg-transparent items-center text-base font-semibold leading-6 text-[#0050d4]"
        >
          {selectedValue}
          <ChevronDown size={13.5} className="text-[#0050d4]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="text-sm font-medium cursor-pointer"
          onClick={() => handleSelect("Popular")}
        >
          Popular
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm font-medium cursor-pointer"
          onClick={() => handleSelect("Newest")}
        >
          Newest
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm font-medium cursor-pointer"
          onClick={() => handleSelect("Oldest")}
        >
          Oldest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
