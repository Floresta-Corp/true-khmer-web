import { Award } from "lucide-react";
import type { AnswerResponse, QuestionResponse } from "~/types/api-client";
import AnswerNewCard from "../card/answer-new-card";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/forum.$id";
interface ForumBestAnswerProps {
  answer?: AnswerResponse;
  userId: string | null;
  question?: QuestionResponse;
}

export default function ForumBestAnswer({
  answer,
  userId,
  question,
}: ForumBestAnswerProps) {
  const { reportReasons } = useLoaderData<typeof loader>();

  if (!answer) {
    return (
      <div className="mt-6 rounded-2xl border border-[#e1e7ef] bg-white p-4 sm:p-6 lg:px-8 lg:py-8">
        <h2 className="mb-6 text-lg font-semibold text-[#030213]">
          Best answer
        </h2>
      </div>
    );
  }

  const isCurrentAuthor = userId === answer.author.id;
  const isAuthenticated = Boolean(userId);
  const isQuestionAuthor = userId === question?.author.id;
  const repliesKey = answer.repliedAnswers?.map((r) => r.id).join(",") ?? "";
  const mappedReportReasons =
    reportReasons?.reportingTypes.map((v) => ({
      id: v.id,
      reason: v.type,
    })) ?? [];

  return (
    <div
      className="flex flex-col gap-6"
      data-node-id="15523:5112"
      data-name="Answers Section"
    >
      {/* Heading */}
      <div
        className="flex gap-2 items-center"
        data-node-id="15523:5113"
        data-name="Heading 3"
      >
        <Award size={26} className="text-[#0050D4]" />
        <h3
          className="text-[18px] font-bold text-[#2c2f31]"
          data-node-id="15523:5117"
        >
          Best Answer
        </h3>
      </div>

      <AnswerNewCard
        reportReasons={mappedReportReasons}
        isQuestionAuthor={isQuestionAuthor}
        answer={answer}
        isBestAnswer={true}
        isAuthenticated={isAuthenticated}
        isCurrentAuthor={isCurrentAuthor}
        index={0}
        userId={userId}
        key={repliesKey}
      />
    </div>
  );
}
