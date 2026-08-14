import { motion, useReducedMotion } from "motion/react";
import { HERO_EASE } from "./home-motion";

const HERO_BACKGROUND = "/home-welcome-hero-bg.svg";

const ALIGN_TO_CONTAINER =
  "translateX(calc(min(100%, 75rem) / 2 - 1.5rem - 44.709%))";

interface HomeWelcomeHeroSectionProps {
  name?: string | null;
}

export function HomeWelcomeHeroSection({ name }: HomeWelcomeHeroSectionProps) {
  const firstName = name?.trim().split(/\s+/)[0];
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;

  return (
    <section className="relative flex min-h-115 flex-col overflow-hidden bg-white lg:min-h-[max(650px,70vh,34.4vw)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 * dur, ease: HERO_EASE }}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-115 bg-linear-to-r from-[#D5EDFF] to-[#FFFFFF] lg:hidden"
        style={{
          clipPath: "ellipse(120% 100% at 50% 0%)",
        }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 * dur, ease: HERO_EASE }}
        className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block"
        aria-hidden
      >
        <div className="relative" style={{ transform: ALIGN_TO_CONTAINER }}>
          <div className="absolute top-0 right-full h-[72.795%] w-screen bg-[#D5EDFF]" />
          <div className="absolute top-0 left-full h-[84.99%] w-screen bg-linear-to-b from-white to-[#FCFEFF]" />
          <img src={HERO_BACKGROUND} alt="" className="h-auto w-full" />
        </div>
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10 site-container flex flex-1 items-center pt-4 pb-6 sm:pt-8 lg:min-h-[max(420px,34.4vw)] lg:flex-none lg:items-center lg:pt-0">
        <div className="mx-auto max-w-md text-center sm:max-w-xl lg:mx-0 lg:max-w-3xl lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 * dur, ease: HERO_EASE }}
            className="text-sm font-semibold text-[#1c5dd4]"
          >
            {firstName ? `Welcome, ${firstName}!` : "Welcome!"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6 * dur,
              delay: 0.15 * dur,
              ease: HERO_EASE,
            }}
            className="mt-3 text-[30px] leading-[1.15] font-medium tracking-[-0.04em] text-[#333333] sm:text-5xl sm:tracking-[-0.06em] lg:text-[60px] lg:leading-18"
          >
            Find Opportunities.
            <br />
            Make An Impact Today.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5 * dur,
              delay: 0.3 * dur,
              ease: HERO_EASE,
            }}
            className="mt-4 max-w-xl text-base leading-7 text-[#606060] sm:mt-5 sm:text-lg"
          >
            Join discussions, launch ideas, volunteer, and attend events with
            people building Cambodia's future.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
