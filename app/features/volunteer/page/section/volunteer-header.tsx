import { ChevronDown, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { loader } from "../../routes/volunteer";
import type { Location } from "~/services/volunteer/volunteer-types";

const LOCATIONS = [
  { value: "anywhere", label: "Anywhere" },
  { value: "phnom-penh", label: "Phnom Penh" },
  { value: "siem-reap", label: "Siem Reap" },
  { value: "battambang", label: "Battambang" },
];

interface VolunteerHeaderProps {
  locations: Location[];
}

export default function VolunteerHeader({ locations }: VolunteerHeaderProps) {
  const { userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [location, setLocation] = useState(locations[0]);
  const linkTo = userId
    ? "/volunteer/create"
    : "/login?redirectTo=/volunteer/create";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
      className="flex w-full items-center justify-center bg-linear-to-r from-sky-100 to-white px-4 py-12 md:h-125 md:px-6 md:py-0"
    >
      <div className="flex w-full max-w-360 flex-col items-center gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="flex flex-col items-center gap-4 md:gap-5"
        >
          <h1 className="text-center text-[30px] font-semibold capitalize leading-9 tracking-[-0.75px] text-[#1C5DD4] sm:text-[34px] sm:leading-10 md:text-[42px] md:leading-10.5 md:tracking-[-1.05px]">
            Volunteer Opportunities
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.5,
              delay: prefersReducedMotion ? 0 : 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="w-full max-w-146.25 px-2 text-center text-sm font-medium leading-6 text-[#65758b] sm:px-1 sm:text-base"
          >
            We connect volunteers to causes that uplift Cambodian communities.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="flex w-full max-w-196 flex-col gap-5"
        >
          <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-5.25">
            <motion.div
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }}
              transition={{ duration: 0.2 }}
              className="flex min-h-16.25 flex-1 flex-col rounded-xl border border-[#f3f4f6] bg-white px-2 py-2 sm:px-[11.5px] sm:py-px md:h-16.25 md:flex-row md:items-center md:gap-3.5"
            >
              <div className="flex h-10.5 w-full flex-1 items-center gap-[10.5px] px-3.5">
                <Search className="size-[17.5px] shrink-0 text-[#99a1af]" />
                <Input
                  type="search"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(
                        `/volunteer/all?search=${e.currentTarget.value}`,
                      );
                    }
                  }}
                  placeholder="Search by name or mission...."
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
                  <DropdownMenuContent align="end">
                    {locations.map((loc) => (
                      <DropdownMenuItem
                        key={loc.name}
                        onSelect={() => setLocation(loc)}
                      >
                        {loc.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.03 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full md:w-auto"
            >
              <Link to={linkTo}>
                <Button
                  size="lg"
                  className="h-14 w-full min-w-0 cursor-pointer gap-1.5 rounded-lg bg-[#2f6fe4] px-6 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca] md:min-w-47.75 md:w-auto"
                >
                  <Plus className="size-4" />
                  Post opportunity
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
