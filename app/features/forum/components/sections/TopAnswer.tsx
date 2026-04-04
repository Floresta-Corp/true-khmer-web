import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import AnswerCard from "../AnswerCard";
import type { Answer } from "~/services/forum/types";

interface TopAnswerProps {
  answer: Answer;
}

export default function TopAnswer({ answer }: TopAnswerProps) {
  return (
    <motion.section
      className="mt-5 flex flex-col gap-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Heading */}
      <div className="flex items-center gap-1.5 px-[7px]">
        <Trophy className="h-3.5 w-3.5 text-[#f59e0b]" />
        <h2 className="text-[13px] font-semibold uppercase tracking-[1.3px] text-[#99a1af]">
          Top Answer
        </h2>
      </div>

      <AnswerCard answer={answer} index={0} />
    </motion.section>
  );
}
