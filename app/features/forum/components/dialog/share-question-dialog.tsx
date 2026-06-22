import { Share2 } from "lucide-react";
import { toast } from "sonner";
import type { Question } from "~/services/forum/forum-types";

interface ShareQuestionButtonProps {
  question: Question;
  /** optional answer id to include in the share link (without the "answer-" prefix) */
  answerId?: string | null;
  className?: string;
}

export default function ShareQuestionButton({
  question,
  answerId = null,
  className = "group inline-flex items-center gap-2 text-xs font-medium text-[#48566A] text-[14px] rounded-lg cursor-pointer transition-colors hover:text-blue-600",
}: ShareQuestionButtonProps) {
  if (!question) return null;

  const handleCopy = async () => {
    const hashPart = (() => {
      if (answerId) return `#answer-${answerId}`;
      if (typeof window !== "undefined" && window.location.hash)
        return window.location.hash;
      return "";
    })();

    const shareUrl =
      typeof window !== "undefined"
        ? new URL(
            `/forum/detail/${question.id}${hashPart}`,
            window.location.origin,
          ).href
        : `/forum/detail/${question.id}${hashPart}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={className}
    >
      <Share2
        size={20}
        className="text-[#48566A] group-hover:text-blue-600 transition-colors"
      />
      Share
    </button>
  );
}
