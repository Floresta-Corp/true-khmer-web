import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import type { Question } from "~/services/forum/forum-types";

interface ShareQuestionDialogProps {
  question: Question;
  trigger: React.ReactNode;
  /** optional answer id to include in the share link (without the "answer-" prefix) */
  answerId?: string | null;
}

export default function ShareQuestionDialog({
  question,
  trigger,
  answerId = null,
}: ShareQuestionDialogProps) {
  if (!question) return null;

  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-sm rounded-2xl">
        <div>
          <div className="flex items-center gap-1.5 text-lg font-semibold">
            <Share2 size={15} />
            Share
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#dbe3ee] bg-[#f9fafb] px-3 py-2 text-sm text-[#595c5e]">
            <p className="min-w-0 flex-1 break-all">{shareUrl}</p>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleCopy}
              className="border-[#dbe3ee] shrink-0"
            >
              {isCopied ? (
                <Check className="size-4 text-[#19a95e]" />
              ) : (
                <Copy className="size-4 text-[#99a1af]" />
              )}
            </Button>
          </div>

          {isCopied && (
            <p className="text-sm text-[#19a95e]">Link copied to clipboard!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
