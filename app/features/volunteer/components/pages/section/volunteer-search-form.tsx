import { ChevronDown, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { motion } from "motion/react";
import type { Location } from "~/features/volunteer/types/volunteer-types";

const easings = {
  enter: "easeInOut" as const,
};

export default function VolunteerSearchForm({
  dur,
  locations,
  searchValue,
  onSearchValueChange,
  searchBaseUrl = "/volunteer/all",
}: {
  dur: number;
  locations: Location[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchBaseUrl?: string;
}) {
  const navigate = useNavigate();
  const allLocations = [{ id: "", name: "All locations" }, ...locations];
  const [location, setLocation] = useState<Location>(allLocations[0]);
  const buildUrl = (search: string, locationId: string | null) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (locationId && locationId !== "anywhere")
      params.set("locationId", locationId);
    const qs = params.toString();
    return qs ? `${searchBaseUrl}?${qs}` : searchBaseUrl;
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
            onChange={(event) => onSearchValueChange(event.currentTarget.value)}
            placeholder="Search opportunities..."
            aria-label="Search volunteer opportunities"
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
          size="icon"
          aria-label="Search"
          className="h-11 w-full shrink-0 cursor-pointer rounded-full bg-[#2463eb] text-white hover:bg-[#1d56d2] sm:w-11"
          style={{ transitionDuration: dur ? "200ms" : "0ms" }}
        >
          <Search className="size-4" />
        </Button>
      </div>
    </motion.form>
  );
}
