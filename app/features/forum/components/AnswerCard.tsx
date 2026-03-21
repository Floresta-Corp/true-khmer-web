import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import ReportDialog from "./ReportDialog";

export interface AnswerData {
  id: string;
  body: string;
  votes: number;
  postedAt: string;
  author: {
    name: string;
    role?: string;
    avatarUrl?: string;
  };
}

interface AnswerCardProps {
  answer: AnswerData;
  index?: number;
}

function VoteRail({ votes }: { votes: number }) {
  return (
    <div className="flex w-7 shrink-0 flex-col items-center gap-[5.25px] pt-[3.5px]">
      <Button
        variant="ghost"
        size="icon"
        className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#f3f4f6] bg-[#f9fafb] text-[#9eacc0] transition-colors hover:border-[#2f6fe4] hover:text-[#2f6fe4]"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </Button>
      <span className="text-[11px] font-semibold leading-[16.5px] text-[#4a5565]">
        {votes}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="flex h-7 w-7 items-center justify-center rounded-xl border border-[#f3f4f6] bg-[#f9fafb] text-[#9eacc0] transition-colors hover:text-[#344256]"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export default function AnswerCard({ answer, index = 0 }: AnswerCardProps) {
  const avatarSrc =
    answer.author.avatarUrl ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      answer.author.name,
    )}`;

  return (
    <motion.article
      className="flex flex-col items-start rounded-2xl border border-[#f3f4f6] bg-white p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className="flex w-full gap-5 items-start">
        {/* Vote rail */}
        <VoteRail votes={answer.votes} />

        {/* Content */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          {/* Answer body */}
          <p className="text-xs leading-normal text-[#65758b]">{answer.body}</p>

          {/* Footer: author + timestamp */}
          <div className="flex items-center justify-between border-t border-[#f9fafb] pt-[0.8px] gap-3">
            {/* Author */}
            <div className="flex items-center gap-[10.5px]">
              <div className="shrink-0 size-7 rounded-full border border-[#f3f4f6] overflow-hidden">
                <img
                  src={avatarSrc}
                  alt={answer.author.name}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-[3.5px]">
                <p className="text-xs font-semibold leading-[12px] text-[#030213] whitespace-nowrap">
                  {answer.author.name}
                </p>
                {answer.author.role && (
                  <p className="text-[10px] font-medium leading-[15px] text-[#99a1af] whitespace-nowrap">
                    {answer.author.role}
                  </p>
                )}
              </div>
            </div>

            {/* Timestamp + flag */}
            <div className="flex items-center gap-[10.5px] shrink-0">
              <span className="text-xs font-medium text-[#99a1af] whitespace-nowrap">
                {answer.postedAt}
              </span>
              <ReportDialog postTitle={answer.body} />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
