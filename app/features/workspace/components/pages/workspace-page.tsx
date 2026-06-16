import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import type { loader } from "../../routes/workspace";
import type { MyWorkSpaceLoaderData } from "~/routes/api/workspace/work-space-loader";
import WorkspaceSkeleton from "../workspace-skeleton";
import WorkspaceQuestionItem from "../card/workspace-question-card";
import WorkspaceAnswerItem from "../card/workspace-my-answer-card";
import WorkspaceTabs from "../work-space-tab";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import { MessageCircleQuestion, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {};

type TabType = "questions" | "answers";

function EmptyWorkspaceState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Icon className="mx-auto mb-4 size-10 text-slate-300" />
      <p className="text-base font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default function WorkSpacePage({}: Props) {
  const { categories, answers, questions } =
    useLoaderData<typeof loader>() as MyWorkSpaceLoaderData;
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
              <EmptyWorkspaceState
                icon={MessageCircleQuestion}
                title="No questions posted yet."
                description="Questions you start in the forum will appear here."
              />
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
            <EmptyWorkspaceState
              icon={Search}
              title="No answers posted yet."
              description="Answers you share with the community will appear here."
            />
          )}
        </div>
      </div>
    </WorkSpacePageLayout>
  );
}
