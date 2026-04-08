import { ChevronDown, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const LOCATIONS = [
  { value: "anywhere", label: "Anywhere" },
  { value: "phnom-penh", label: "Phnom Penh" },
  { value: "siem-reap", label: "Siem Reap" },
  { value: "battambang", label: "Battambang" },
];

export default function VolunteerHeader() {
  const [location, setLocation] = useState(LOCATIONS[0]);

  return (
    <section className="flex w-full items-center justify-center bg-linear-to-r from-sky-100 to-white px-4 py-12 md:h-125 md:px-6 md:py-0">
      <div className="flex w-full max-w-360 flex-col items-center gap-6 md:gap-8">
        <div className="flex flex-col items-center gap-4 md:gap-5">
          <h1 className="text-center text-[30px] font-semibold capitalize leading-9 tracking-[-0.75px] text-[#1C5DD4] sm:text-[34px] sm:leading-10 md:text-[42px] md:leading-10.5 md:tracking-[-1.05px]">
            Volunteer Opportunities
          </h1>
          <p className="w-full max-w-146.25 px-2 text-center text-sm font-medium leading-6 text-[#65758b] sm:px-1 sm:text-base">
            We connect volunteers to causes that uplift Cambodian communities.
          </p>
        </div>

        <div className="flex w-full max-w-196 flex-col gap-5">
          <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-5.25">
            <div className="flex min-h-16.25 flex-1 flex-col rounded-xl border border-[#f3f4f6] bg-white px-2 py-2 sm:px-[11.5px] sm:py-px md:h-16.25 md:flex-row md:items-center md:gap-3.5">
              <div className="flex h-10.5 w-full flex-1 items-center gap-[10.5px] px-3.5">
                <Search className="size-[17.5px] shrink-0 text-[#99a1af]" />
                <Input
                  type="search"
                  placeholder="Search by name or mission...."
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
            <Link to="/volunteer/post" className="w-full md:w-auto">
              <Button
                size="lg"
                className="h-14 w-full min-w-0 gap-1.5 rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca] md:min-w-47.75 md:w-auto"
              >
                <Plus className="size-4" />
                Post opportunity
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
