import { Search, ChevronDown, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
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
import type { Location } from "~/services/volunteer/types/location";

const ANYWHERE: Location = { id: "anywhere", name: "Anywhere" };

interface HeaderSearchProps {
  postButton?: string;
  inputPlaceholder?: string;
  postUrl?: string;
  buttonWidth?: string;
  locations?: Location[];
  searchBaseUrl?: string;
}

export default function HeaderSearch({
  postButton,
  postUrl,
  inputPlaceholder,
  buttonWidth,
  locations = [],
  searchBaseUrl = "/launchpad/all",
}: HeaderSearchProps) {
  const allLocations = [ANYWHERE, ...locations];
  const [location, setLocation] = useState<Location>(ANYWHERE);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const buildUrl = (search: string, cityId: string | null) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (cityId && cityId !== "anywhere") params.set("cityId", cityId);
    const qs = params.toString();
    return qs ? `${searchBaseUrl}?${qs}` : searchBaseUrl;
  };

  const handleSearch = () => {
    navigate(buildUrl(searchValue, location.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.code === "NumpadEnter") {
      handleSearch();
    }
  };

  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
    navigate(buildUrl(searchValue, loc.id));
  };

  return (
    <>
      <div className="flex min-h-16.25 flex-1 flex-col rounded-xl border border-[#f3f4f6] bg-white px-2 py-2 sm:px-[11.5px] sm:py-px md:h-16.25 md:flex-row md:items-center md:gap-3.5 items-center">
        <div className="flex h-10.5 w-full flex-1 items-center gap-[10.5px] px-3.5">
          <Search className="size-[17.5px] shrink-0 text-[#99a1af]" />
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder || "Search by name or mission...."}
            className="h-10.5 border-0 bg-transparent px-0 py-0 text-sm font-semibold text-[#364153] placeholder:font-semibold placeholder:text-[#99a1af] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="h-px w-full shrink-0 bg-[#f3f4f6] md:h-8.75 md:w-px" />
        <div className="flex w-full justify-start px-2 md:w-auto md:px-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8.5 w-full items-center justify-between gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold leading-[19.5px] text-[#364153] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-auto md:justify-start">
              {location.name}
              <ChevronDown className="size-3.5 text-[#364153]/65" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="max-h-64 overflow-y-auto"
            >
              {allLocations.map((loc) => (
                <DropdownMenuItem
                  key={loc.id}
                  onSelect={() => handleLocationSelect(loc)}
                >
                  {loc.name}
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
            "cursor-pointer h-14 min-w-0 gap-1.5 rounded-[18px] bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:bg-[#245fca] md:min-w-47.75 md:w-auto",
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