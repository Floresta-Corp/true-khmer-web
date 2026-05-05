import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnswerNewCard from "../card/answer-new-card";
import type { Answer } from "~/services/forum/forum-types";
import type { loader } from "../../routes/forum.$id";
import { useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";

interface AllAnswersProps {
  answers: Answer[];
}

export default function AllAnswers({ answers }: AllAnswersProps) {
  const { userId, reportReasons, question } = useLoaderData<typeof loader>();
  const answersKey = answers.map(a => a.id + (a.repliedAnswers?.map(r => r.id).join(',') ?? '')).join('|');

  return (
    <motion.section
      className="mt-5 flex flex-col gap-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium leading-6.75 text-[#2c2f31]">
          All {answers.length} Answers
        </h2>
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold leading-5 text-[#595c5e]">
            Sort by:
          </p>
          <Button
            variant={"default"}
            type="button"
            className="inline-flex bg-transparent items-center text-base font-semibold leading-6 text-[#0050d4]"
          >
            Popular
            <ChevronDown size={13.5} className="text-[#0050d4]" />
          </Button>
        </div>
      </div>

      {/* Answer list */}
      <div className="flex flex-col gap-6" key={answersKey}>
        {answers.map((answer, i) => {
          const isCurrentAuthor = userId === answer.author.id ? true : false;
          return (
            <AnswerNewCard
              userId={userId}
              key={answer.id}
              answer={answer}
              index={i}
              isCurrentAuthor={isCurrentAuthor}
              isAuthenticated={Boolean(userId)}
              isQuestionAuthor={userId === question?.author.id}
              reportReasons={reportReasons.reportingTypes.map((v) => ({
                id: v.id,
                reason: v.type,
              }))}
            />
          );
        })}
      </div>
    </motion.section>
  );
}
