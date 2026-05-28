import { Megaphone, Search } from "lucide-react";
import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { loader } from "../../routes/volunteer";
import type { Location } from "~/services/volunteer/volunteer-types";

const easings = {
  enter: "easeInOut" as const,
  smooth: "easeInOut" as const,
};

const floatAnimation = {
  y: [0, -12, 0],
  scale: [1, 1.03, 1],
  rotate: [0, 1, 0],
  transition: {
    duration: 6,
    ease: "easeInOut" as const,
    repeat: Infinity,
  },
};

const volunteerHeroBackgroundImage = "/images/volunteer-header-background.png";

function VolunteerHeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.img
        alt=""
        src={volunteerHeroBackgroundImage}
        animate={floatAnimation}
        className="absolute inset-0 h-full w-full object-cover object-center opacity-100"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.92)_45%,rgba(255,255,255,0.98)_100%)]" />
    </div>
  );
}

function VolunteerSearchForm({
  dur,
  searchValue,
  onSearchValueChange,
  onSubmit,
}: {
  dur: number;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 * dur, ease: "easeInOut" as const } }}
      transition={{
        duration: 0.55 * dur,
        delay: 0.2 * dur,
        ease: easings.enter,
      }}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="w-full max-w-107.5"
    >
      <div className="flex w-full items-stretch overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-shadow duration-300 ease-out has-[button:hover]:shadow-[0_18px_50px_rgba(36,99,235,0.12)] has-[button:focus-visible]:shadow-[0_18px_50px_rgba(36,99,235,0.12)]">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.currentTarget.value)}
            placeholder="Search by cause or location..."
            aria-label="Search volunteer opportunities"
            className="h-12 border-0 bg-transparent pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-[16px] bg-[#2463eb] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(36,99,235,0.18)] transition-transform duration-200 hover:-translate-y-px hover:bg-[#1d56d2]"
          style={{ transitionDuration: dur ? "200ms" : "0ms" }}
        >
          Explore
        </Button>
      </div>
    </motion.form>
  );
}

function VolunteerPostButton({ to, dur }: { to: string; dur: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.2 * dur, ease: "easeInOut" as const } }}
      transition={{
        duration: 0.55 * dur,
        delay: 0.35 * dur,
        ease: easings.enter,
      }}
      className="w-full md:w-auto rounded-[18px]"
    >
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-14 w-full rounded-[18px] border-[#d7e3ff] bg-white px-6 text-[15px] font-semibold text-[#2463eb] shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[#2463eb] hover:bg-blue-50 hover:shadow-[0_12px_32px_rgba(36,99,235,0.12)] md:w-auto md:min-w-54"
      >
        <Link to={to}>
          <motion.span
            animate={
              dur
                ? {
                    rotate: [0, -10, 10, -5, 0],
                  }
                : undefined
            }
            transition={{
              duration: 1.2,
              ease: "easeInOut" as const,
              repeat: Infinity,
              repeatDelay: 4,
            }}
            className="inline-flex"
          >
            <Megaphone className="size-4" />
          </motion.span>
          Post an Opportunity
        </Link>
      </Button>
    </motion.div>
  );
}

interface VolunteerHeaderProps {
  locations: Location[];
}

export default function VolunteerHeader({ locations }: VolunteerHeaderProps) {
  const { userId } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;
  const [searchValue, setSearchValue] = useState("");
  const linkTo = userId
    ? "/volunteer/create"
    : "/login?redirectTo=/volunteer/create";

  const handleSearch = () => {
    const trimmedSearch = searchValue.trim();
    const params = new URLSearchParams();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    navigate(
      params.size > 0
        ? `/volunteer/all?${params.toString()}`
        : "/volunteer/all",
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" as const } }}
      transition={{ duration: 0.4 * dur, ease: "easeInOut" as const }}
      className="relative flex w-full justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
    >
      <VolunteerHeroBackdrop />

      <div className="relative flex w-full max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeInOut" as const } }}
          transition={{
            duration: 0.7 * dur,
            ease: easings.enter,
          }}
          className="flex flex-col items-center gap-4 sm:gap-5"
        >
          <h1 className="max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-slate-900 sm:tracking-[-0.06em]">
            Make an impact that{" "}
            <motion.span
              animate={
                dur
                  ? {
                      color: ["#2463eb", "#7c3aed", "#db2777", "#2463eb"],
                      scale: [1, 1.03, 1, 1],
                    }
                  : undefined
              }
              transition={{
                duration: 6,
                ease: "easeInOut" as const,
                repeat: Infinity,
              }}
              className="inline-block text-[#2463eb]"
            >
              matters.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.2, ease: "easeInOut" as const } }}
            transition={{
              duration: 0.6 * dur,
              delay: 0.15 * dur,
              ease: easings.enter,
            }}
            className="max-w-2xl text-base font-medium leading-7 text-slate-500 sm:text-lg sm:leading-8"
          >
            Find meaningful ways to give back. Explore opportunities that match
            your skills and make a real difference.
          </motion.p>
        </motion.div>

        <div className="flex w-full flex-col items-center gap-5 sm:gap-6">
          <VolunteerSearchForm
            dur={dur}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            onSubmit={handleSearch}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeInOut" as const } }}
            transition={{
              duration: 0.5 * dur,
              delay: 0.3 * dur,
              ease: easings.enter,
            }}
            className="flex w-full max-w-[18rem] items-center gap-4 px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:max-w-[20rem]"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                backgroundColor: dur
                  ? ["#e2e8f0", "#93c5fd", "#e2e8f0"]
                  : undefined,
              }}
              transition={{
                scaleX: { duration: 0.6 * dur, ease: easings.smooth },
                backgroundColor: {
                  duration: 4,
                  ease: "easeInOut" as const,
                  repeat: Infinity,
                },
              }}
              className="h-px origin-left flex-1 bg-slate-200"
            />
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4 * dur,
                ease: easings.smooth,
              }}
              className="inline-block"
            >
              Or
            </motion.span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                backgroundColor: dur
                  ? ["#e2e8f0", "#93c5fd", "#e2e8f0"]
                  : undefined,
              }}
              transition={{
                scaleX: { duration: 0.6 * dur, ease: easings.smooth },
                backgroundColor: {
                  duration: 4,
                  ease: "easeInOut" as const,
                  repeat: Infinity,
                  delay: 2,
                },
              }}
              className="h-px origin-right flex-1 bg-slate-200"
            />
          </motion.div>

          <VolunteerPostButton to={linkTo} dur={dur} />
        </div>
      </div>
    </motion.section>
  );
}
