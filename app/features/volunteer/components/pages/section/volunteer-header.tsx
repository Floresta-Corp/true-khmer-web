import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import type { loader } from "../../../route/volunteer";
import type { Location } from "~/features/volunteer/types/volunteer-types";
import VolunteerSearchForm from "./volunteer-search-form";

const easings = {
  enter: "easeInOut" as const,
  smooth: "easeInOut" as const,
};

const volunteerHeroImage = "/images/volunteer-hero.png";

function VolunteerHeroImage({ dur }: { dur: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 * dur, ease: easings.enter }}
      className="relative -my-8 -mr-10 h-[calc(100%+64px)] w-full"
    >
      <div className="relative z-0 h-full w-full overflow-hidden rounded-tl-[120px]">
        <img
          src={volunteerHeroImage}
          alt="Volunteers planting a tree together"
          loading="eager"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </motion.div>
  );
}

function VolunteerPostLink({ to, dur }: { to: string; dur: number }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -12,
        transition: { duration: 0.2 * dur, ease: "easeInOut" as const },
      }}
      transition={{
        duration: 0.5 * dur,
        delay: 0.35 * dur,
        ease: easings.enter,
      }}
      className="text-sm text-slate-500"
    >
      Have an opportunity to share?{" "}
      <Link
        to={to}
        className="group relative inline-flex items-center gap-1 font-semibold text-[#2463eb] transition-colors hover:text-[#1d56d2]"
      >
        <span className="relative">
          Post an opportunity
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-center scale-x-0 bg-[#2463eb] transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:bg-[#1d56d2]" />
        </span>

        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </motion.p>
  );
}

interface VolunteerHeaderProps {
  locations: Location[];
}

export default function VolunteerHeader({ locations }: VolunteerHeaderProps) {
  const { userId } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;
  const [searchValue, setSearchValue] = useState("");
  const linkTo = userId
    ? "/volunteer/create"
    : "/login?redirectTo=/volunteer/create";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2, ease: "easeInOut" as const },
      }}
      transition={{ duration: 0.4 * dur, ease: "easeInOut" as const }}
      className="relative w-full overflow-hidden bg-white"
    >
      <div className="site-container grid grid-cols-1 items-stretch gap-8 pt-10 pb-2 sm:pt-12 sm:pb-3 lg:grid-cols-12 lg:gap-5 lg:py-5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: "easeInOut" as const },
          }}
          transition={{ duration: 0.7 * dur, ease: easings.enter }}
          className="flex flex-col items-start gap-4 py-2 text-left sm:gap-5 lg:col-span-5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#32A8FF] uppercase sm:text-xs">
            <img
              src="/home-explore-volunteer.png"
              className="size-10 object-contain sm:size-12 lg:size-14"
              alt=""
            />
            Volunteer
          </span>

          <h1 className="text-[28px] leading-[1.12] font-bold tracking-[-0.03em] text-slate-900 sm:text-[34px] sm:leading-[1.08] lg:text-[38px]">
            <span className="text-[#32A8FF]">Get involved</span> in your
            community.
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -16,
              transition: { duration: 0.2, ease: "easeInOut" as const },
            }}
            transition={{
              duration: 0.6 * dur,
              delay: 0.15 * dur,
              ease: easings.enter,
            }}
            className="max-w-lg text-[14px] leading-6 text-slate-500 sm:text-base sm:leading-7"
          >
            Discover meaningful volunteer opportunities across Cambodia, from
            weekend projects to flexible roles you can do remotely.
          </motion.p>

          <VolunteerSearchForm
            dur={dur}
            locations={locations}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
          />

          <VolunteerPostLink to={linkTo} dur={dur} />
        </motion.div>

        <div className="hidden w-full items-stretch lg:col-span-7 lg:flex">
          <VolunteerHeroImage dur={dur} />
        </div>
      </div>
    </motion.section>
  );
}
