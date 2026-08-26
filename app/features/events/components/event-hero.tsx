import { Link } from "react-router";
import HeaderSearch from "~/components/header-search";

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
    <section className="relative h-125 bg-linear-to-b from-[#e8ecf8] to-[#f0f2fa] px-4 pt-12 pb-10 md:px-6 md:pt-20 md:pb-14">
      {/* Decorative circles — clipped wrapper */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-48 w-48 -translate-x-1/3 -translate-y-1/4 rounded-full bg-[#d6daf0] opacity-50 md:h-80 md:w-80" />
        <div className="absolute right-0 bottom-0 h-56 w-56 translate-x-1/3 translate-y-1/4 rounded-full bg-[#c8cee8] opacity-40 md:h-96 md:w-96" />
      </div>

      <div className="item,s-center relative mx-auto flex h-full w-full max-w-3xl flex-col justify-center text-center">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[#174FB4] sm:text-4xl md:mb-3 md:text-5xl">
          Explore. <span className="text-[#32A8FF]">Connect.</span> Organize.
        </h1>
        <p className="mx-auto mb-6 max-w-146.25 text-sm leading-relaxed text-gray-500 md:mb-8 md:text-base">
          Find events worth your time, or create one worth remembering.
        </p>

        {/* Search bar */}

        <div className="flex w-full max-w-196 flex-col gap-5">
          <div className="mb-5.25 flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-5.25">
            <HeaderSearch
              postUrl="#"
              postButton="Organize an Event"
              inputPlaceholder="Search events by title, venue, or keyword..."
            />
            {/* <div className="flex-1 flex items-center bg-white rounded-lg h-11 md:h-12 px-4 gap-2 border border-[#F3F4F6]">
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
          </div> */}
            {/* <Link
            to="#"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg h-11 md:h-12 px-5 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Organize an Event</span>
          </Link> */}
          </div>
        </div>

        {/* Supported by */}
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          Supported by{" "}
          <Link
            to={import.meta.env.VITE_PLUMPI_WEB}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 underline underline-offset-2"
          >
            Plumpi Event Management
          </Link>
        </p>
      </div>
    </section>
  );
}
