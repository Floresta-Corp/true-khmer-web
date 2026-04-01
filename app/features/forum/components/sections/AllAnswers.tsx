import { motion } from "framer-motion";
import AnswerCard from "../AnswerCard";
import type { AnswerData } from "../AnswerCard";

interface AllAnswersProps {
  answers: AnswerData[];
}

export default function AllAnswers({ answers }: AllAnswersProps) {
  return (
    <motion.section
      className="mt-5 flex flex-col gap-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Heading */}
      <div className="px-[7px]">
        <h2 className="text-[13px] font-semibold uppercase tracking-[1.3px] text-[#99a1af]">
          All Answers ({answers.length})
        </h2>
      </div>

      {/* Answer list */}
      <div className="flex flex-col gap-3.5">
        {answers.map((answer, i) => (
          <AnswerCard key={answer.id} answer={answer} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
