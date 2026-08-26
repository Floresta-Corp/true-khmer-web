import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { cn } from "~/lib/utils";

type TabType = "questions" | "answers";

type Props = {
  questionCount: number;
  answerCount: number;
};

export default function WorkspaceTabs({ questionCount, answerCount }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: TabType =
    rawTab === "questions" || rawTab === "answers" ? rawTab : "questions";

  const setActiveTab = (tab: TabType) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        // Filters are per-tab — clear them on any switch so a question-tab
        // sort/search doesn't leak into the answers fetch (and vice versa).
        next.delete("search");
        next.delete("sortBy");
        next.delete("category");
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="relative flex w-full rounded-xl bg-gray-100 p-1 shadow-inner sm:w-max dark:bg-slate-900/50">
      {(["questions", "answers"] as TabType[]).map((tab) => {
        const isActive = activeTab === tab;
        const count = tab === "questions" ? questionCount : answerCount;
        const label = tab === "questions" ? "My Questions" : "My Answers";
        const shortLabel = tab === "questions" ? "Questions" : "Answers";

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative flex flex-1 cursor-pointer items-center justify-center gap-2 sm:flex-none sm:gap-3",
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 sm:px-8 sm:py-2.5",
              isActive
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            <span className="relative z-20 hidden sm:inline">{label}</span>
            <span className="relative z-20 sm:hidden">{shortLabel}</span>

            {/* The Count Badge - Needs z-20 to stay above the slider */}
            <span
              className={cn(
                "relative z-20 flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-bold transition-colors duration-300 sm:text-xs",
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-slate-500 dark:bg-slate-800",
              )}
            >
              {count}
            </span>

            {/* tabs animation */}
            {isActive && (
              <motion.div
                layoutId="activeTabWorkspace"
                className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                style={{ zIndex: 10 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
