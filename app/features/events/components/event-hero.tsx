import { Link } from "react-router";
import { CalendarDays, Search } from "lucide-react";

interface EventHeroProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

/**
 * Events hub hero.
 *
 * The photo fills the panel and a left-to-right wash of the page tint keeps the
 * copy column readable, exactly as in the design. The photo is a background
 * image rather than an `<img>` so the panel still reads as designed if the
 * asset is missing.
 */
export function EventHero({
  search,
  onSearchChange,
  onSearchSubmit,
}: EventHeroProps) {
  return (
    <section className="relative mb-8 flex min-h-115 overflow-hidden rounded-[24px] bg-[#F7F8FC]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/images/events/hero-connect.jpg')] bg-cover bg-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,#F7F8FC_0%,rgba(247,248,252,0.95)_40%,rgba(247,248,252,0.6)_58%,rgba(247,248,252,0.2)_78%,rgba(247,248,252,0)_92%)]"
      />

      <div className="relative flex max-w-140 flex-col justify-center px-6 py-12 sm:px-10">
        <div className="mb-3.5 flex items-center gap-2">
          <img
            src="/home-explore-event.png"
            alt=""
            className="size-14 shrink-0 rounded-[16px] object-contain"
          />
          <span className="text-[13px] font-bold tracking-[0.05em] text-[#1C5DD4]">
            TRUE KHMER EVENTS
          </span>
        </div>

        <h1 className="mb-4 text-[30px] leading-[1.18] font-extrabold text-[#1A1A2E] sm:text-[38px]">
          Find experiences that bring Cambodia{" "}
          <span className="text-[#1C5DD4]">together.</span>
        </h1>

        <p className="mb-6.5 text-sm leading-[1.6] text-[#9A9AB0]">
          Conferences, workshops and meetups from organizations across the
          country.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
          className="flex max-w-130 items-center gap-2.5 rounded-full bg-white py-1.5 pr-1.5 pl-5.5 shadow-[0_4px_16px_rgba(26,26,46,0.10)]"
        >
          <Search className="size-4 shrink-0 text-[#9A9AB0]" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search events, topics, or organizers..."
            aria-label="Search events, topics, or organizers"
            className="w-full min-w-0 border-none bg-transparent py-2 text-sm text-[#333333] outline-none placeholder:text-[#9A9AB0]"
          />
          <button
            type="submit"
            aria-label="Search events"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1C5DD4] text-white transition-colors hover:bg-[#174FB4]"
          >
            <Search className="size-4" aria-hidden />
          </button>
        </form>

        <p className="mt-4.5 flex flex-wrap items-center gap-2 text-[13px] text-[#9A9AB0]">
          <CalendarDays
            className="size-4 shrink-0 text-[#1C5DD4]"
            aria-hidden
          />
          Organizing something?{" "}
          <Link
            to={import.meta.env.VITE_PLUMPI_WEB}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1C5DD4] hover:underline"
          >
            Create your own event →
          </Link>
        </p>
      </div>
    </section>
  );
}
