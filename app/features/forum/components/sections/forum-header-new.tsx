import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import AskQuestionDialog from "../dialog/ask-question-dialog";
import type { loader } from "../../route/forum.new";

const heroBackgroundImage = "/images/hero-background-image.webp";
const avatarImage = "/images/forum-avatar.jpg";
const trendingIcon = "/icons/apollo-icon.svg";
const activeIcon = "/icons/conversation-icon.svg";

export default function ForumHeaderNew() {
  const navigate = useNavigate();
  const { categories, userId } = useLoaderData<typeof loader>();
  const isAuthenticated = Boolean(userId);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeNowCount, setActiveNowCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const dur = prefersReducedMotion ? 0 : 1;
  const float = prefersReducedMotion ? 0 : 1;
  const trimmedSearchValue = searchValue.trim();
  const canSearch = trimmedSearchValue.length > 0;

  useEffect(() => {
    const targetCount = 1200;

    if (prefersReducedMotion) {
      setActiveNowCount(targetCount);
      return;
    }

    const duration = 1500;
    const startDelay = 700;
    const startTime = performance.now();
    let animationFrame = 0;
    let timeoutId = 0;

    const updateCount = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setActiveNowCount(Math.round(targetCount * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    timeoutId = window.setTimeout(() => {
      animationFrame = requestAnimationFrame(updateCount);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  const handleSearch = () => {
    if (isSearching || !canSearch) return;

    setIsSearching(true);
    navigate(`/forum/search?search=${encodeURIComponent(trimmedSearchValue)}`);
  };

  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden px-4 py-12 md:px-12 md:py-24">
      <img
        src={heroBackgroundImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-25"
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 * dur, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex w-full flex-col items-center gap-2 text-center md:gap-3"
        >
          <h1 className="text-4xl leading-12 font-semibold tracking-[-1px] text-[#2c2f31] md:text-6xl md:leading-18 md:tracking-[-1.8px]">
            Knowledge is a
            <span className="block bg-linear-to-r from-[#0050d4] to-[#7b9cff] bg-clip-text text-transparent">
              Collective Impact.
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6 * dur,
              delay: 0.15 * dur,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="max-w-2xl px-2 text-sm leading-6 text-[#595c5e] md:text-xl md:leading-7"
          >
            Join 50,000+ innovators and creators in a True Khmer community
            wisdom. Shape the future, one conversation at a time.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5 * dur,
            delay: 0.3 * dur,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex w-full max-w-2xl flex-col gap-4 md:flex-row md:items-center md:justify-center"
        >
          <div className="flex h-12 flex-1 items-center gap-3 rounded-lg border border-[#e1e7ef] bg-white pl-3 pr-2 py-3  md:rounded-xl">
            <Search className="size-4.5 shrink-0 text-[#8f9294]" />
            <input
              type="search"
              value={searchValue}
              disabled={isSearching}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && canSearch) {
                  handleSearch();
                }
              }}
              placeholder="Search discussions"
              className="w-full border-0 bg-transparent text-base text-[#2c2f31] placeholder:text-[#abadaf] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <motion.button
              type="button"
              onClick={handleSearch}
              disabled={!canSearch || isSearching}
              whileHover={
                canSearch && !isSearching ? { scale: 1.02 } : undefined
              }
              whileTap={canSearch && !isSearching ? { scale: 0.98 } : undefined}
              animate={{
                scale: isSearching ? 0.985 : 1,
                opacity: isSearching ? 0.95 : 1,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className="rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 transition-[background-color,box-shadow,opacity,transform] duration-300 hover:bg-blue-600 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:hover:bg-slate-300"
            >
              <motion.span
                animate={{ y: isSearching ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className="block"
              >
                {isSearching ? "Loading..." : "Search"}
              </motion.span>
            </motion.button>
          </div>

          <AskQuestionDialog
            categories={categories}
            isAuthenticated={isAuthenticated}
            trigger={
              <button
                type="button"
                className="inline-flex h-8 md:h-12 items-center justify-center gap-2 rounded-lg md:rounded-xl bg-[#0050d4] px-6 text-base font-semibold text-[#f1f2ff] transition-colors hover:bg-[#0044b4]"
              >
                <span className="text-[18px] leading-none">+</span>
                Ask a Question
              </button>
            }
          />
        </motion.div>

        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 1, x: 0, y: 0, rotate: -6 }
              : { opacity: 0, x: -40, rotate: -6 }
          }
          animate={{ opacity: 1, x: 0, y: [0, -4 * float, 0], rotate: -6 }}
          transition={{
            opacity: { duration: 0.6 * dur, delay: 0.5 * dur },
            x: { duration: 0.6 * dur, delay: 0.5 * dur },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
          }}
          className="pointer-events-none absolute -left-2 top-8 hidden rotate-6 rounded-xl border border-[#d5e2fa] bg-white/80 p-4 shadow-[0px_32px_64px_0px_rgba(44,47,49,0.06)] backdrop-blur-sm lg:block"
        >
          <div className="flex items-center gap-3">
            <img
              src={avatarImage}
              alt=""
              aria-hidden
              className="size-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-bold text-[#2c2f31]">
                New badge earned!
              </p>
              <p className="text-[10px] text-[#595c5e]">Top Contributor</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 1, x: 0, y: 0, rotate: 12 }
              : { opacity: 0, x: 40, rotate: 12 }
          }
          animate={{ opacity: 1, x: 0, y: [0, 6 * float, 0], rotate: 12 }}
          transition={{
            opacity: { duration: 0.6 * dur, delay: 0.7 * dur },
            x: { duration: 0.6 * dur, delay: 0.7 * dur },
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            },
          }}
          className="pointer-events-none absolute -right-5 top-0 hidden rotate-12 rounded-[14.5px] border border-[#d5edff] bg-white/70 p-5 shadow-[0px_38px_77px_0px_rgba(44,47,49,0.06)] backdrop-blur-md lg:block"
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <img src={trendingIcon} alt="" aria-hidden className="size-3.5" />
              <p className="text-sm font-bold text-[#2c2f31]">Trending Topic</p>
            </div>
            <div className="h-1.25 w-24 overflow-hidden rounded-full bg-[#0050d4]/20">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: 1 * dur,
                  delay: 0.75 * dur,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "left" }}
                className="h-full w-2/3 rounded-full bg-[#0050d4]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 1, x: 0, y: 0, rotate: -12 }
              : { opacity: 0, x: -40, rotate: -12 }
          }
          animate={{ opacity: 1, x: 0, y: [0, -5 * float, 0], rotate: -12 }}
          transition={{
            opacity: { duration: 0.6 * dur, delay: 0.9 * dur },
            x: { duration: 0.6 * dur, delay: 0.9 * dur },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            },
          }}
          className="pointer-events-none absolute bottom-12 left-2 hidden -rotate-12 rounded-xl border border-[#84ebb4] bg-[#1fc16b]/5 p-4 shadow-[0px_32px_64px_0px_rgba(44,47,49,0.06)] backdrop-blur-sm lg:block"
        >
          <div className="flex items-center gap-2">
            <img src={activeIcon} alt="" aria-hidden className="size-3.75" />
            <p className="text-xs font-semibold text-[#2c2f31]">
              {activeNowCount.toLocaleString()} active now
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
