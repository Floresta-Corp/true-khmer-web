import { Share2 } from "lucide-react";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import type { QuestionResponse } from "~/types/api-client";

interface ShareQuestionButtonProps {
  question: QuestionResponse;
  className?: string;
  iconClassName?: string;
}

export default function ShareQuestionButton({
  question,
  className = "group inline-flex items-center gap-2 text-xs font-medium text-[#48566A] text-[14px] rounded-lg cursor-pointer transition-colors hover:text-blue-600",
  iconClassName = "size-5",
}: ShareQuestionButtonProps) {
  if (!question) return null;

  const handleCopy = async () => {
    const hash =
      typeof window !== "undefined" && window.location.hash
        ? window.location.hash
        : "";
    const encodedHash = hash ? `#${hash.slice(1)}`.replace(/ /g, "%20") : "";
    await copyToClipboard(
      buildAbsoluteUrl(`/forum/detail/${question.id}${encodedHash}`),
    );
  };

  return (
    <button onClick={handleCopy} className={className}>
      <Share2
        className={`${iconClassName} text-[#48566A] transition-colors group-hover:text-blue-600`}
      />
      Share
    </button>
  );
}
