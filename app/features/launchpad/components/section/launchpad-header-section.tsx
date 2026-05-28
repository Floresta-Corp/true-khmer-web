import { useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import HeaderSearch from "~/components/header-search";
import type { loader } from "~/features/launchpad/routes/launchpad";

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

const launchpadHeroBackgroundImage = "/images/volunteer-header-background.png";

function LaunchpadHeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.img
        alt=""
        src={launchpadHeroBackgroundImage}
        animate={floatAnimation}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.92)_45%,rgba(255,255,255,0.98)_100%)]" />
    </div>
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
      exit={{ opacity: 0, transition: { duration: 0.2 * dur, ease: "easeInOut" as const } }}
      transition={{ duration: 0.4 * dur, ease: "easeInOut" as const }}
      className="relative flex w-full justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:py-24"
    >
      <LaunchpadHeroBackdrop />

      <div className="relative flex w-full max-w-4xl flex-col items-center gap-8 text-center sm:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.2 * dur, ease: "easeInOut" as const } }}
          transition={{
            duration: 0.7 * dur,
            ease: easings.enter,
          }}
          className="flex flex-col items-center gap-4 sm:gap-5"
        >
          <h1 className="max-w-3xl text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-slate-900 sm:tracking-[-0.06em]">
            Where Ideas Take{" "}
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
              Off.
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.2 * dur, ease: "easeInOut" as const } }}
            transition={{
              duration: 0.6 * dur,
              delay: 0.15 * dur,
              ease: easings.enter,
            }}
            className="max-w-2xl text-base font-medium leading-7 text-slate-500 sm:text-lg sm:leading-8"
          >
            Connect with founders, explore the next generation of Khmer impact,
            and find co-operation opportunities.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.2 * dur, ease: "easeInOut" as const } }}
          transition={{
            duration: 0.55 * dur,
            delay: 0.3 * dur,
            ease: easings.enter,
          }}
          className="flex w-full flex-col items-center gap-5 sm:gap-6"
        >
          <HeaderSearch
            postButton="Post project"
            postUrl="/launchpad/create"
            inputPlaceholder="Search project by name..."
            locations={locations}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
