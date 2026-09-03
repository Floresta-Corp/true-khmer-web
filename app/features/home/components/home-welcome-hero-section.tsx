import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";

const HERO_BACKGROUND = "/images/home-hero.png";

interface HomeWelcomeHeroSectionProps {
  name?: string | null;
}

export function HomeWelcomeHeroSection({ name }: HomeWelcomeHeroSectionProps) {
  const firstName = name?.trim().split(/\s+/)[0] || name?.trim();
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;

  return (
    <section className="relative site-container mt-10 mb-10 min-h-90 overflow-hidden rounded-3xl bg-[#EEF6FF] px-6 py-10 sm:min-h-[420px] md:px-10 lg:min-h-[420px] lg:px-12 lg:py-14">
      <motion.img
        src={HERO_BACKGROUND}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 * dur }}
        className="object-right-right pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-[#F8FBFF] via-[#F8FBFF]/95 via-45% to-[#F8FBFF]/0"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-70 max-w-xl flex-col justify-center space-y-6 sm:min-h-[340px] lg:min-h-[308px]">
        <p className="text-sm font-semibold text-[#2563EB]">
          Welcome back, {firstName ?? "Friend"}!
        </p>

        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-[2.5rem]">
          Find opportunities, <br />
          <span className="text-[#2563EB]">make an impact</span> today.
        </h1>

        <p className="text-sm leading-relaxed text-slate-500 md:text-base">
          Join discussions, launch ideas, volunteer, and attend events with
          people building Cambodia's future.
        </p>

        {/* Search Input Bar */}
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
