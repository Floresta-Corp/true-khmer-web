import { Link, useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import HeaderSearch from "~/components/header-search";
import type { loader } from "~/features/launchpad/route/launchpad";
import { ArrowRight } from "lucide-react";

const easings = {
  enter: "easeInOut" as const,
  smooth: "easeInOut" as const,
};

const launchpadHeroImage = "/images/launchpad-hero.png";

function LaunchpadHeroImage({ dur }: { dur: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 * dur, ease: easings.enter }}
      className="relative mx-auto flex h-full w-[95%] items-center"
    >
      <div className="relative max-h-95 w-full overflow-hidden">
        <img
          alt="Launchpad hero image"
          src={launchpadHeroImage}
          className="max-h-95 w-full object-contain object-center"
        />
      </div>
    </motion.div>
  );
}

function LaunchpadPostLink({ to, dur }: { to: string; dur: number }) {
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
      Looking for people to join your projects?{" "}
      <Link
        to={to}
        className="group relative inline-flex items-center gap-1 font-semibold text-[#2463eb] transition-colors hover:text-[#1d56d2]"
      >
        <span className="relative">
          Post project here
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-full origin-center scale-x-0 bg-[#2463eb] transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:bg-[#1d56d2]" />
        </span>

        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </motion.p>
  );
}

export default function LaunchpadHeaderSection() {
  const { locations } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 * dur, ease: "easeInOut" as const },
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
            transition: { duration: 0.2 * dur, ease: "easeInOut" as const },
          }}
          transition={{
            duration: 0.7 * dur,
            ease: easings.enter,
          }}
          className="flex flex-col items-start gap-4 py-2 text-left sm:gap-5 lg:col-span-5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#32A8FF] uppercase sm:text-xs">
            <img
              src="/home-explore-launchpad.png"
              className="size-8 object-contain sm:size-12 lg:size-14"
              alt=""
            />
            Project
          </span>

          <h1 className="text-[28px] leading-[1.12] font-bold tracking-[-0.03em] text-slate-900 sm:text-[34px] sm:leading-[1.08] lg:text-[44px]">
            Launch your project{" "}
            <span className="text-[#32A8FF]">with confidence.</span>
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
            Discover startups and projects looking for people like you. Join a
            team and be part of something from the start.
          </motion.p>

          <HeaderSearch
            postButton="Post project"
            postUrl="/launchpad/create"
            inputPlaceholder="Search projects..."
            locations={locations}
            dur={dur}
          />

          <LaunchpadPostLink to="/launchpad/create" dur={dur} />
        </motion.div>

        <div className="hidden w-full items-stretch lg:col-span-7 lg:flex">
          <LaunchpadHeroImage dur={dur} />
        </div>
      </div>
    </motion.section>
  );
}
