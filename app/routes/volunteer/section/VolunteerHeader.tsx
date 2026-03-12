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
    <section className="flex min-h-125 w-full items-center justify-center bg-quadrant-glow px-6 py-16">
      <div className="flex w-full max-w-360 flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-center text-[38px] font-semibold capitalize leading-10.5 tracking-[-1.05px] text-[#174fb4] md:text-[42px]">
            Hearts &amp; Hands
          </h1>
          <p className="w-full max-w-146.25 px-1 text-center text-base font-medium leading-6 text-[#65758b]">
            We connect volunteers to causes that uplift Cambodian communities.
          </p>
        </div>

        <div className="flex w-full max-w-196 flex-col gap-5">
          <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-[21px]">
            <div className="flex h-16.25 flex-1 items-center gap-3.5 rounded-xl border border-[#f3f4f6] bg-white px-[11.5px] py-px">
              <div className="flex h-10.5 flex-1 items-center gap-[10.5px] px-[14px]">
                <Search className="size-[17.5px] shrink-0 text-[#99a1af]" />
                <Input
                  type="search"
                  placeholder="Search by name or mission...."
                  className="h-10.5 border-0 bg-transparent px-0 py-0 text-sm font-semibold text-[#364153] placeholder:font-semibold placeholder:text-[#99a1af] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="h-8.75 w-px shrink-0 bg-[#f3f4f6]" />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8.5 items-center gap-1.5 rounded-xl px-3.5 text-[13px] font-semibold leading-[19.5px] text-[#364153] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
            <Link to="/volunteer/post">
              <Button
                size="lg"
                className="h-14 min-w-47.75 gap-1.5 rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]"
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
