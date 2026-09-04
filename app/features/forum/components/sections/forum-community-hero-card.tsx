import { Image as ImageIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import type { loader } from "../../route/forum.new";
import AskQuestionDialog from "../dialog/ask-question-dialog";

const heroBackgroundImage = "/images/forum-background.jpg";
const avatarImage = "/images/forum-avatar.jpg";

const ACTIVE_MEMBERS = [
  { initials: "SR", className: "bg-[#2f6fe4]" },
  { initials: "CM", className: "bg-[#3fa9f5]" },
  { initials: "DK", className: "bg-[#1fc16b]" },
  { initials: "BF", className: "bg-[#0050d4]" },
];
const ACTIVE_MEMBERS_OVERFLOW = 9;
const ACTIVE_MEMBERS_COUNT = 1200;

export default function ForumCommunityHeroCard() {
  const { categories, userId } = useLoaderData<typeof loader>();
  const isAuthenticated = Boolean(userId);
  const prefersReducedMotion = useReducedMotion();
  const [activeNowCount, setActiveNowCount] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveNowCount(ACTIVE_MEMBERS_COUNT);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    let animationFrame = 0;

    const updateCount = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setActiveNowCount(Math.round(ACTIVE_MEMBERS_COUNT * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [prefersReducedMotion]);

  const activeNowLabel =
    activeNowCount >= 1000
      ? `${(activeNowCount / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : `${activeNowCount}`;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#eef4ff] via-[#f4f8ff] to-[#e6f0ff] p-5 sm:p-8">
      <img
        src={heroBackgroundImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-3/5 object-cover opacity-20 sm:block"
      />

      <div className="relative flex flex-col gap-4 sm:gap-5">
        {/* Presence row (dummy data) */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center -space-x-2">
            {ACTIVE_MEMBERS.map((member) => (
              <span
                key={member.initials}
                className={`inline-flex size-6.5 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold text-white ${member.className}`}
              >
                {member.initials}
              </span>
            ))}
            <span className="inline-flex size-6.5 items-center justify-center rounded-full border-2 border-white bg-[#cbd5e1] text-[10px] font-semibold text-[#475569]">
              +{ACTIVE_MEMBERS_OVERFLOW}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative inline-flex size-2 rounded-full bg-[#1fc16b]">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#1fc16b]/60" />
            </span>
            <p className="text-xs font-medium text-[#48566a] sm:text-sm">
              {activeNowLabel} members active now
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
          className="flex max-w-xl flex-col gap-2"
        >
          <h1 className="text-2xl leading-tight font-semibold tracking-[-0.6px] text-[#0f1729] sm:text-4xl">
            Ask the community something...
          </h1>
          <p className="text-sm leading-6 text-[#48566a] sm:text-base">
            A space to share ideas, ask questions, and support each other.
            Together we learn, grow, and create impact for Cambodia.
          </p>
        </motion.div>

        {/* Composer — opens the existing ask-question dialog */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_24px_0px_rgba(15,23,41,0.06)] sm:p-5">
          <div className="flex items-center gap-3">
            <img
              src={avatarImage}
              alt=""
              aria-hidden
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <AskQuestionDialog
              categories={categories}
              isAuthenticated={isAuthenticated}
              trigger={
                <button
                  type="button"
                  className="min-w-0 flex-1 cursor-pointer truncate bg-transparent text-left text-sm text-[#9eacc0] sm:text-base"
                >
                  What would you like to discuss?
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <AskQuestionDialog
              categories={categories}
              isAuthenticated={isAuthenticated}
              trigger={
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-medium text-[#48566a] transition-colors hover:text-[#0050d4]"
                >
                  <ImageIcon className="size-4.5" />
                  Image
                </button>
              }
            />

            <AskQuestionDialog
              categories={categories}
              isAuthenticated={isAuthenticated}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#2f6fe4] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1f62df]"
                >
                  Post
                </button>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
