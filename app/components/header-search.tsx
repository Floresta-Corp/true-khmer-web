import { Search, ChevronDown, Plus, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { useState } from "react";
import type { Location } from "~/features/volunteer/types/location";
import { Button } from "./ui/button";

const ANYWHERE: Location = { id: "anywhere", name: "Anywhere" };

interface HeaderSearchProps {
  postButton?: string;
  inputPlaceholder?: string;
  postUrl?: string;
  buttonWidth?: string;
  locations?: Location[];
  searchBaseUrl?: string;
  dur: number;
}

const easings = {
  enter: "easeInOut" as const,
};

export default function HeaderSearch({
  postButton,
  postUrl,
  inputPlaceholder,
  buttonWidth,
  locations = [],
  searchBaseUrl = "/launchpad/all",
  dur,
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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -12,
        transition: { duration: 0.2 * dur, ease: "easeInOut" as const },
      }}
      transition={{
        duration: 0.55 * dur,
        delay: 0.2 * dur,
        ease: easings.enter,
      }}
      onSubmit={(event) => {
        event.preventDefault();
        navigate(buildUrl(searchValue, location.id));
      }}
      className="w-full max-w-125"
    >
      <div className="flex w-full flex-col gap-2 rounded-[26px] border border-slate-200/80 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-shadow duration-300 ease-out sm:flex-row sm:items-center sm:rounded-full">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder || "Search projects..."}
            className="h-11 border-0 bg-transparent pr-4 pl-11 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="hidden h-6 w-px shrink-0 bg-slate-200 sm:block" />

        <div className="flex w-full justify-start md:w-auto md:px-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-8.5 w-full cursor-pointer items-center justify-start gap-1.5 rounded-xl px-3.5 text-[13px] leading-[19.5px] font-semibold text-[#99a1af] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:w-auto">
              <MapPin className="size-[17.5px] shrink-0 text-[#99a1af]" />
              {location.name}
              <ChevronDown className="ml-auto size-3.5 text-[#364153]/65 md:ml-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-64 min-w-40 overflow-y-auto"
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
        <Button
          type="submit"
          onClick={handleSearch}
          aria-label="Search"
          className="h-11 w-full shrink-0 cursor-pointer rounded-full bg-[#2463eb] text-white hover:bg-[#1d56d2] sm:w-11"
        >
          <Search className="size-4" />
        </Button>
        {/* <Link
          to={postUrl || "/volunteer/post"}
          className="w-full shrink-0 md:w-auto"
        >
          <Button
            size="lg"
            className={cn(
              "h-14 w-full min-w-0 cursor-pointer gap-1.5 rounded-[18px] bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:bg-[#245fca] md:w-auto md:min-w-47.75",
              buttonWidth ? `w-[${buttonWidth}]` : "",
            )}
          >
            <Plus className="size-4" />
            {postButton ?? "Post opportunity"}
          </Button>
        </Link> */}
      </div>
    </motion.form>
  );
}
