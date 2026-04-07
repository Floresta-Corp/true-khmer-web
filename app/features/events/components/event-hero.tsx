import { Link } from "react-router";
import { Search, Plus, SearchIcon } from "lucide-react";
import { LocationDropdown } from "./location-dropdown";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

interface EventHeroProps {
  search: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  locationOptions: string[];
}

export function EventHero({
  search,
  onSearchChange,
  locationFilter,
  onLocationChange,
  locationOptions,
}: EventHeroProps) {
  return (
    <section className="relative h-125 bg-linear-to-b from-[#e8ecf8] to-[#f0f2fa] pt-12 md:pt-20 pb-10 md:pb-14 px-4 md:px-6">
      {/* Decorative circles — clipped wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 w-48 md:w-80 h-48 md:h-80 rounded-full bg-[#d6daf0] opacity-50 -translate-x-1/3 -translate-y-1/4" />
        <div className="absolute right-0 bottom-0 w-56 md:w-96 h-56 md:h-96 rounded-full bg-[#c8cee8] opacity-40 translate-x-1/3 translate-y-1/4" />
      </div>

      <div className="max-w-3xl text-center h-full w-full flex item,s-center justify-center flex-col mx-auto relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#174FB4] mb-2 md:mb-3 tracking-tight">
          Explore. <span className="text-[#32A8FF]">Connect.</span> Organize.
        </h1>
        <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mb-6 md:mb-8 leading-relaxed">
          Find events worth your time, or create one worth remembering.
        </p>

        {/* Search bar */}

        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
          <div className="flex-1 flex items-center bg-white rounded-lg h-11 md:h-12 px-4 gap-2 border border-[#F3F4F6]">
            <InputGroup className="outline-none border-none ring-0 focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupInput
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search events by title, venue, or keyword..."
                className="flex-1 min-w-0 text-sm bg-transparent border-none outline-none placeholder:text-gray-400 text-gray-700"
              />
              <InputGroupAddon>
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
              </InputGroupAddon>
            </InputGroup>
            <div className="w-px h-5 bg-gray-200 shrink-0" />
            <LocationDropdown
              value={locationFilter}
              onChange={onLocationChange}
              locations={locationOptions}
            />
          </div>
          <Link
            to="#"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg h-11 md:h-12 px-5 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Organize an Event</span>
          </Link>
        </div>

        {/* Supported by */}
        <p className="mt-4 md:mt-5 text-xs text-gray-400 flex items-center justify-center gap-1.5">
          Supported by{" "}
          <Link
            to={import.meta.env.VITE_PLUMPI_WEB}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold underline underline-offset-2"
          >
            Plumpi Event Management
          </Link>
        </p>
      </div>
    </section>
  );
}
