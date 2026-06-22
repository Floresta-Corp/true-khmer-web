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
        // clear answer-specific filters when switching away from answers tab
        if (tab !== "answers") {
          next.delete("search");
          next.delete("sortBy");
          next.delete("category");
        }
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="flex w-full bg-gray-100 dark:bg-slate-900/50 p-1 rounded-xl shadow-inner sm:w-max relative">
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
              "relative flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 cursor-pointer",
              "px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300",
              isActive
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200",
            )}
          >
            <span className="relative z-20 hidden sm:inline">{label}</span>
            <span className="relative z-20 sm:hidden">{shortLabel}</span>

            {/* The Count Badge - Needs z-20 to stay above the slider */}
            <span
              className={cn(
                "relative z-20 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-colors duration-300",
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-slate-800 text-slate-500",
              )}
            >
              {count}
            </span>

            {/* tabs animation */}
            {isActive && (
              <motion.div
                layoutId="activeTabWorkspace"
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
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
