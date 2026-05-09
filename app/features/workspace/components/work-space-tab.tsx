import { useSearchParams } from "react-router";

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
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="flex w-full bg-gray-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner sm:w-max">
      {(["questions", "answers"] as TabType[]).map((tab) => {
        const isActive = activeTab === tab;
        const count = tab === "questions" ? questionCount : answerCount;
        const label = tab === "questions" ? "My Questions" : "My Answers";
        const shortLabel = tab === "questions" ? "Questions" : "Answers";

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 cursor-pointer
              px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all
              ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              }
            `}
          >
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{shortLabel}</span>
            <span
              className={`
                flex items-center justify-center min-w-5 h-5 px-1 rounded-md text-[10px] sm:text-xs font-bold
                ${isActive ? "bg-[#2f6fe4] text-white" : "bg-gray-200 text-[#64748b]"}
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
