import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";

const HERO_BACKGROUND = "/images/home-hero.png";

interface HomeWelcomeHeroSectionProps {
  name?: string | null;
}

export function HomeWelcomeHeroSection({ name }: HomeWelcomeHeroSectionProps) {
  const firstName = name?.trim().split(/\s+/)[0];
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;

  return (
    <section className="relative site-container mt-6 overflow-hidden rounded-3xl bg-[#EEF6FF] px-6 py-8 sm:mt-10 sm:min-h-[420px] sm:py-10 md:px-10 lg:px-12 lg:py-14">
      {/* The artwork and its left-to-right scrim are a desktop split: an opaque
          wash behind the copy on the left, clear over the art on the right. A
          phone has no right half, so both are dropped below `sm` and the card's
          flat #EEF6FF shows through instead. */}
      <motion.img
        src={HERO_BACKGROUND}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 * dur }}
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover sm:block"
        alt=""
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 hidden bg-linear-to-r from-[#F8FBFF] via-[#F8FBFF]/95 via-45% to-[#F8FBFF]/0 sm:block"
        aria-hidden
      />

      <div className="relative z-10 flex max-w-xl flex-col justify-center space-y-4 sm:min-h-[340px] sm:space-y-6 lg:min-h-[308px]">
        <p className="text-sm font-semibold text-[#2563EB]">
          Welcome back, {firstName || "Friend"}!
        </p>

        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-[2.5rem]">
          Find opportunities,{" "}
          {/* Wrapped rather than given `hidden sm:inline` directly: setting
              `display` on a <br> overwrites WebKit/Blink's internal
              `display-outside: newline` and kills the break. */}
          <span className="hidden sm:inline">
            <br />
          </span>
          <span className="text-[#2563EB]">make an impact</span> today.
        </h1>

        <p className="text-sm leading-relaxed text-slate-500 md:text-base">
          Join discussions, launch ideas, volunteer, and attend events with
          people building Cambodia's future.
        </p>

        <div className="pt-2">
          <div className="relative flex max-w-md items-center rounded-full bg-white p-1.5 shadow-lg ring-1 shadow-slate-200/70 ring-slate-200/80 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="ml-3.5 h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="opportunity"
              className="w-full bg-transparent px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white transition-all hover:bg-blue-700 active:scale-95"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
