import { Search, ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useState } from "react";
import { cn } from "~/lib/utils";

const LOCATIONS = [
  { value: "anywhere", label: "Anywhere" },
  { value: "phnom-penh", label: "Phnom Penh" },
  { value: "siem-reap", label: "Siem Reap" },
  { value: "battambang", label: "Battambang" },
];

interface HeaderSearchProps {
  postButton?: string;
  inputPlaceholder?: string;
  postUrl?: string;
  buttonWidth?: string;
}

export default function HeaderSearch({
  postButton,
  postUrl,
  inputPlaceholder,
  buttonWidth,
}: HeaderSearchProps) {
  const [location, setLocation] = useState(LOCATIONS[0]);
  return (
    <>
      <div className="flex min-h-16.25 flex-1 flex-col rounded-xl border border-[#f3f4f6] bg-white px-2 py-2 sm:px-[11.5px] sm:py-px md:h-16.25 md:flex-row md:items-center md:gap-3.5 items-center">
        <div className="flex h-10.5 w-full flex-1 items-center gap-[10.5px] px-3.5">
          <Search className="size-[17.5px] shrink-0 text-[#99a1af]" />
          <Input
            type="search"
            placeholder={inputPlaceholder || "Search by name or mission...."}
            className="h-10.5 border-0 bg-transparent px-0 py-0 text-sm font-semibold text-[#364153] placeholder:font-semibold placeholder:text-[#99a1af] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="h-px w-full shrink-0 bg-[#f3f4f6] md:h-8.75 md:w-px" />
        <div className="flex w-full justify-start px-2 md:w-auto md:px-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8.5 w-full items-center justify-between gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold leading-[19.5px] text-[#364153] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-auto md:justify-start">
              {location.label}
              <ChevronDown className="size-3.5 text-[#364153]/65" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LOCATIONS.map((loc) => (
                <DropdownMenuItem
                  key={loc.value}
                  onSelect={() => setLocation(loc)}
                >
                  {loc.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Link to={postUrl || "/volunteer/post"} className="w-full md:w-auto">
        <Button
          size="lg"
          className={cn(
            "cursor-pointer h-14 min-w-0 gap-1.5 rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca] md:min-w-47.75 md:w-auto",
            `w-[${buttonWidth || "150px"}]`,
          )}
        >
          <Plus className="size-4" />
          {postButton ?? "Post opportunity"}
        </Button>
      </Link>
    </>
  );
}
