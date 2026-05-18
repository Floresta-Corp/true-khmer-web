import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import type { loader } from "../../routes/workspace";
import WorkspaceSkeleton from "../workspace-skeleton";
import WorkspaceQuestionItem from "../card/workspace-question-card";
import WorkspaceAnswerItem from "../card/workspace-my-answer-card";
import WorkspaceTabs from "../work-space-tab";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";

type Props = {};

type TabType = "questions" | "answers";

export default function WorkSpacePage({}: Props) {
  const { categories, answers, questions } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: TabType =
    rawTab === "questions" || rawTab === "answers" ? rawTab : "questions";

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  return (
    <WorkSpacePageLayout
      title="My Discussions"
      subtitle="Track your community engagement and shared knowledge."
    >
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
                  categories={categories}
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
    </WorkSpacePageLayout>
  );
}
