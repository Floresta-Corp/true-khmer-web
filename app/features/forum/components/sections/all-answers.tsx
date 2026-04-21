import { motion } from "framer-motion";
import AnswerNewCard from "../card/answer-new-card";
import type { Answer } from "~/services/forum/forum-types";
import type { loader } from "../../routes/forum.$id";
import { useLoaderData } from "react-router";

interface AllAnswersProps {
  answers: Answer[];
}

export default function AllAnswers({ answers }: AllAnswersProps) {
  const { userId } = useLoaderData<typeof loader>();
  return (
    <motion.section
      className="mt-5 flex flex-col gap-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Heading */}
      <div className="px-1.75 flex items-center">
        <h2 className="text-[18px] font-medium text-[#2C2F31]">
          All {answers.length} Answers
        </h2>
        <div className="text-[14px]">
          <p className="font-semibold text-[#595C5E]">Sort by:</p>
        </div>
      </div>

      {/* Answer list */}
      <div className="flex flex-col gap-6">
        {answers.map((answer, i) => {
          const isCurrentAuthor = userId === answer.author.id ? true : false;
          return (
            <AnswerNewCard
              key={answer.id}
              answer={answer}
              index={i}
              isCurrentAuthor={isCurrentAuthor}
              isAuthenticated={Boolean(userId)}
            />
          );
        })}
      </div>
    </motion.section>
  );
}
