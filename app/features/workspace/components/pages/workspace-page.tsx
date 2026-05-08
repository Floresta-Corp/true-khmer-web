import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import type { MyAnswerItem, Question } from "~/services/forum/types";
import WorkspaceSkeleton from "../workspace-skeleton";
import WorkspaceQuestionItem from "../card/workspace-question-card";
import WorkspaceAnswerItem from "../card/workspace-my-answer-card";
import WorkspaceTabs from "../work-space-tab";

type Props = {
  questions: Question[];
  answers: MyAnswerItem[];
};

type TabType = "questions" | "answers";

export default function WorkSpacePage({ questions, answers }: Props) {
  const [searchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: TabType =
    rawTab === "questions" || rawTab === "answers" ? rawTab : "questions";

  const [isLoading, setIsLoading] = useState(false);
  const [prevTab, setPrevTab] = useState<TabType>(activeTab);

  useEffect(() => {
    if (activeTab !== prevTab) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setPrevTab(activeTab);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [activeTab, prevTab]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <WorkspaceTabs
        questionCount={questions.length}
        answerCount={answers.length}
      />

      <div className="flex flex-col gap-2 sm:gap-3">
        {isLoading ? (
          <WorkspaceSkeleton />
        ) : activeTab === "questions" ? (
          questions.length > 0 ? (
            questions.map((question, index) => (
              <WorkspaceQuestionItem
                key={question.id}
                question={question}
                index={index}
              />
            ))
          ) : (
            <p className="text-sm text-[#64748b]">No questions posted yet.</p>
          )
        ) : answers.length > 0 ? (
          answers.map((answer, index) => (
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
