import { Link } from "react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";

const CARD =
  "absolute hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(26,26,46,0.14)] sm:block";

interface EducationHeroProps {
  displayName: string;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
}

export function EducationHero({
  displayName,
  search,
  onSearchChange,
  onSearchSubmit,
}: EducationHeroProps) {
  return (
    <section className="mb-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="min-w-0">
        <div className="mb-5 flex items-center gap-3">
          <img
            src="/images/education/learning-mark.jpg"
            alt=""
            className="size-9 shrink-0 object-contain"
          />
          <span className="text-[13px] font-bold tracking-[0.08em] text-[#1C5DD4]">
            TRUE KHMER LEARNING
          </span>
        </div>

        <h1 className="mb-6 text-[32px] leading-[1.3] font-normal text-[#1A1A2E] sm:text-[36px]">
          Hello {displayName},
          <br />
          Ready to grow your{" "}
          <span className="font-bold text-[#1C5DD4]">skills?</span>
        </h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
          className="mb-3.5 flex max-w-120 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white py-1.5 pr-1.5 pl-5"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search courses, skills or topics..."
            aria-label="Search courses, skills or topics"
            className="w-full min-w-0 border-none bg-transparent py-2 text-sm text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1C5DD4] text-white transition-colors hover:bg-[#174FB4]"
          >
            <Search className="size-4" aria-hidden />
          </button>
        </form>

        <p className="text-sm text-[#6B7280]">
          Know something worth teaching?{" "}
          <Link
            to="/education/create"
            className="inline-flex items-center gap-1 font-semibold text-[#1C5DD4] hover:underline"
          >
            Create a course
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </p>
      </div>

      <div className="relative min-w-0">
        <div className="h-70 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#EEF3FD_0%,#F7F9FC_45%,#E4EDFB_100%)] sm:h-86.25">
          <img
            src="/images/education/hero-learner.webp"
            alt=""
            width={1212}
            height={690}
            className="size-full object-cover object-center"
          />
        </div>

        <div className={`${CARD} top-4 -left-4 px-4 py-3`}>
          <div className="mb-1.5 text-[11px] text-[#9A9AB0]">
            Keep learning!
          </div>
          <div className="flex items-center gap-1.5 text-[22px] font-extrabold text-[#1A1A2E]">
            <span aria-hidden>🔥</span> 7
          </div>
          <div className="text-[10px] text-[#9A9AB0]">Day streak</div>
        </div>

        <div className={`${CARD} bottom-14 -left-4 w-47.5 px-4.5 py-3.5`}>
          <div className="mb-2 text-[11px] text-[#9A9AB0]">
            Continue learning
          </div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#1C5DD4]">
              <Sparkles className="size-4 text-white" aria-hidden />
            </span>
            <span className="text-[13px] font-bold text-[#1A1A2E]">
              Intro to AI Lessons
            </span>
          </div>
          <div className="h-1.25 overflow-hidden rounded-full bg-[#E8E8E8]">
            <div className="h-full w-3/4 bg-[#1C5DD4]" />
          </div>
          <div className="mt-1.25 text-[10px] text-[#9A9AB0]">75% complete</div>
        </div>

        <div
          className={`${CARD} top-13 -right-4 min-w-45 px-4 py-3 whitespace-nowrap`}
        >
          <div className="mb-1 text-[11px] text-[#9A9AB0]">Your goal</div>
          <div className="mb-1 text-[13px] font-bold text-[#1A1A2E]">
            Web Developer
          </div>
          <div className="text-[10px] text-[#9A9AB0]">80%</div>
        </div>

        <div
          className={`${CARD} -right-4 bottom-5 min-w-47.5 px-4 py-3 whitespace-nowrap`}
        >
          <div className="mb-1.5 text-[11px] text-[#9A9AB0]">
            Students love True Khmer
          </div>
          <div className="text-[12px] font-bold text-[#1A1A2E]">
            <span className="text-[#F5A623]" aria-hidden>
              ★
            </span>{" "}
            4.8 (120 reviews)
          </div>
        </div>
      </div>
    </section>
  );
}
