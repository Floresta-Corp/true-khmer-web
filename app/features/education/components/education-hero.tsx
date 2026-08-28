import { Link } from "react-router";
import { ArrowRight, Search, Sparkles, Star } from "lucide-react";
import type { LearnerSnapshot } from "~/features/education/types";

const CARD = "rounded-xl bg-white shadow-[0_4px_20px_rgba(26,26,46,0.12)]";

interface EducationHeroProps {
  learner: LearnerSnapshot;
  topics: string[];
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onTopicSelect: (topic: string) => void;
}

export function EducationHero({
  learner,
  topics,
  search,
  onSearchChange,
  onSearchSubmit,
  onTopicSelect,
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
          Hello {learner.displayName},
          <br />
          Ready to grow your{" "}
          <span className="font-bold text-[#1C5DD4]">skills?</span>
        </h1>

        <div className="mb-6 flex flex-wrap gap-2.5">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => onTopicSelect(topic)}
              className="cursor-pointer rounded-full bg-[#F3F4F6] px-3.5 py-2 text-[13px] whitespace-nowrap text-[#374151] transition-colors hover:bg-[#E5E7EB]"
            >
              {topic}
            </button>
          ))}
        </div>

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
        {/* The photo is cropped to exactly this panel (1212x690 for a 606x345
            box at 2x), so object-cover fills it without shifting the framing.
            The gradient stays behind it as a backdrop. The cards below overlap
            the panel edges, as in the design. */}
        <div className="h-70 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#EEF3FD_0%,#F7F9FC_45%,#E4EDFB_100%)] sm:h-86.25">
          <img
            src="/images/education/hero-learner.webp"
            alt=""
            width={1212}
            height={690}
            className="size-full object-cover object-center"
          />
        </div>

        {/* Day streak — top left */}
        <div className={`absolute top-6 -left-2 px-4 py-3 sm:left-2 ${CARD}`}>
          <p className="mb-1 text-xs font-medium text-[#6B7280]">
            Keep learning!
          </p>
          <p className="flex items-center gap-1.5 text-xl font-bold text-[#1A1A2E]">
            <span aria-hidden>🔥</span>
            {learner.dayStreak}
          </p>
          <p className="text-xs text-[#6B7280]">Day streak</p>
        </div>

        {/* Goal — top right */}
        <div
          className={`absolute top-14 -right-2 px-4 py-3 sm:right-2 ${CARD}`}
        >
          <p className="mb-1 text-xs text-[#6B7280]">Your goal</p>
          <p className="text-sm font-bold text-[#1A1A2E]">
            {learner.goalTitle}
          </p>
          <p className="text-xs text-[#6B7280]">{learner.goalPercent}%</p>
        </div>

        {/* Continue learning — middle left */}
        <div
          className={`absolute bottom-16 -left-4 w-52.5 px-4 py-3 sm:left-0 ${CARD}`}
        >
          <p className="mb-2 text-xs text-[#6B7280]">Continue learning</p>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#1C5DD4]">
              <Sparkles className="size-4 text-white" aria-hidden />
            </span>
            <span className="text-sm leading-tight font-bold text-[#1A1A2E]">
              {learner.continueCourseTitle}
            </span>
          </div>
          <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#1C5DD4]"
              style={{ width: `${learner.continuePercent}%` }}
            />
          </div>
          <p className="text-xs text-[#6B7280]">
            {learner.continuePercent}% complete
          </p>
        </div>

        {/* Platform rating — bottom right */}
        <div
          className={`absolute -right-2 -bottom-3 px-4 py-3 sm:right-2 ${CARD}`}
        >
          <p className="mb-1 text-xs text-[#6B7280]">
            Students love True Khmer
          </p>
          <p className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A2E]">
            <Star
              className="size-4 fill-amber-400 text-amber-400"
              aria-hidden
            />
            {learner.platformRating} ({learner.platformReviewCount} reviews)
          </p>
        </div>
      </div>
    </section>
  );
}
