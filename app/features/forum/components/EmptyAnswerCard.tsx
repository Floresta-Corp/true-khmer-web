import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import AddAnswerDialog from "./AddAnswerDialog";
import type { Question } from "~/services/forum/types";

interface EmptyAnswerCardProps {
  question: Question;
}

export default function EmptyAnswerCard({ question }: EmptyAnswerCardProps) {
  return (
    <>
      <motion.div
        className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#344256]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.18,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <MessageSquare className="h-4 w-4 text-[#9eacc0]" />
        <span>{question.answerCount} Answers</span>
      </motion.div>
      <motion.div
        className="mt-4 rounded-2xl border border-dashed border-[#e2e8f0] bg-white p-10 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.22,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-[#c8d6e5]" />
        <p className="text-sm font-medium text-[#9eacc0]">
          No answers yet — be the first to help!
        </p>
        <div className="mt-4">
          <AddAnswerDialog />
        </div>
      </motion.div>
    </>
  );
}
