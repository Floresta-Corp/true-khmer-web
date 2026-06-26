import { Share2 } from "lucide-react";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import type { QuestionResponse } from "~/types/api-client";

interface ShareQuestionButtonProps {
  question: QuestionResponse;
  className?: string;
}

export default function ShareQuestionButton({
  question,
  className = "group inline-flex items-center gap-2 text-xs font-medium text-[#48566A] text-[14px] rounded-lg cursor-pointer transition-colors hover:text-blue-600",
}: ShareQuestionButtonProps) {
  if (!question) return null;

  const handleCopy = async () => {
    await copyToClipboard(buildAbsoluteUrl(`/forum/detail/${question.id}`));
  };

  return (
    <button onClick={handleCopy} className={className}>
      <Share2
        size={20}
        className="text-[#48566A] group-hover:text-blue-600 transition-colors"
      />
      Share
    </button>
  );
}
