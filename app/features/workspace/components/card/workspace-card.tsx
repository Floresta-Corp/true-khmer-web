import type {
  Answer,
  CategoriesPicker,
  MyAnswerItem,
  Question,
} from "~/services/forum/types";
import WorkspaceQuestionItem from "./workspace-question-card";
import WorkspaceAnswerItem from "./workspace-my-answer-card";
import { useSearchParams } from "react-router";

type Props = {
  questions: Question[];
  answer: MyAnswerItem[];
};

type TabType = "questions" | "answers";

export default function WorkSpaceCard({ questions, answer }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabType) || "questions";

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab });
  };
  if (!questions || questions.length === 0) {
    return <p className="text-sm text-[#64748b]">No questions posted yet.</p>;
  }

  const questionCount = questions.length;
  const answerCount = answer.length;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Tabs - compact on mobile */}
      <div className="flex w-full bg-gray-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner sm:w-max">
        <button
          onClick={() => setActiveTab("questions")}
          className={`
      flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 cursor-pointer
      px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all
      ${
        activeTab === "questions"
          ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
      }
    `}
        >
          <span className="hidden sm:inline">My Questions</span>
          <span className="sm:hidden">Questions</span>
          <span
            className={`
        flex items-center justify-center min-w-5 h-5 px-1 rounded-md text-[10px] sm:text-xs font-bold
        ${activeTab === "questions" ? "bg-[#2f6fe4] text-white" : "bg-gray-200 text-[#64748b]"}
      `}
          >
            {questionCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("answers")}
          className={`
      flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 cursor-pointer 
      px-4 sm:px-8 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all
      ${
        activeTab === "answers"
          ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
      }
    `}
        >
          <span className="hidden sm:inline">My Answers</span>
          <span className="sm:hidden">Answers</span>
          <span
            className={`
        flex items-center justify-center min-w-5 h-5 px-1 rounded-md text-[10px] sm:text-xs font-bold
        ${activeTab === "answers" ? "bg-[#2f6fe4] text-white" : "bg-gray-200 text-[#64748b]"}
      `}
          >
            {answerCount}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {activeTab === "questions" ? (
          questionCount > 0 ? (
            questions.map((question) => (
              <WorkspaceQuestionItem
                key={question.id}
                question={question}
                // categories={categories}
              />
            ))
          ) : (
            <p className="text-sm text-[#64748b]">No questions posted yet.</p>
          )
        ) : answerCount > 0 ? (
          answer?.map((answer, index) => (
            <WorkspaceAnswerItem
              key={answer.id}
              answer={answer}
              index={index}
            />
          ))
        ) : (
          <p className="text-sm text-[#64748b]">No answers posted yet.</p>
        )}
      </div>
    </div>
  );
}
