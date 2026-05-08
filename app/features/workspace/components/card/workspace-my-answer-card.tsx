import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import type { Answer, MyAnswerItem, Question } from "~/services/forum/types";
import { motion } from "framer-motion";
import DeleteAnswerDialog from "~/features/forum/components/dialog/delete-answer-dialog";
import { Button } from "~/components/ui/button";
import AddAnswerDialog from "~/features/forum/components/dialog/add-answer-dialog";

type Props = {
  answer: MyAnswerItem;
  index: number;
};

export default function WorkspaceAnswerItem({ answer, index = 0 }: Props) {
  const createdAgoLabel = formatMinutesOrHoursAgo(answer?.createdAt ?? "");
  const profileImage = answer?.author?.avatarKey
    ? resolveImageURL(answer.author.avatarKey)
    : "";

  return (
    <motion.article
      className="w-full rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 lg:p-6 shadow-[0px_4px_24px_0px_rgba(0,0,0,0.04)] mb-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Header - Author info with category and timestamp */}
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Avatar className="border border-[#f3f4f6] shrink-0 h-10 w-10">
            <AvatarImage
              src={profileImage}
              alt={answer?.author?.name || "User"}
              className="object-cover"
            />
          </Avatar>

          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <p className="text-sm font-semibold text-[#344256] truncate">
              {answer?.author?.name}
            </p>
            <span className="text-[#d1d5db]">•</span>
            <span className="text-sm font-semibold text-blue-600 truncate">
              {answer?.question?.category?.name || "Discussion"}
            </span>

            <span className="text-[#d1d5db]">•</span>
            <span className="text-sm text-[#9ca3af]">{createdAgoLabel}</span>
          </div>
        </div>

        {/* Edit / Delete buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center justify-end">
            <div className="flex h-[26.25px] w-[59.5px] items-center gap-1.75">
              <AddAnswerDialog
                questionId={answer?.question?.id}
                isEditing
                data={{ id: answer?.id ?? "", body: answer?.body ?? "" }}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-[26.25px] w-[26.25px] rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                  >
                    <Pencil size={12.25} />
                  </Button>
                }
              />
              <DeleteAnswerDialog
                answerId={answer?.id ?? ""}
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-[26.25px] min-w-[26.25px] flex-1 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
                  >
                    <Trash2 size={12.25} />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* "Replying to" label and question title */}
      <div className="mb-3">
        <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-wide mb-1.5">
          REPLYING TO:
        </p>
        <Link
          to={`/forum/detail/${answer?.question?.id}`}
          className="text-base sm:text-lg font-semibold text-[#1f2937] hover:text-blue-600 transition-colors"
        >
          {answer?.question?.title || "Question unavailable"}
        </Link>
      </div>

      {/* Answer body in quote style */}
      <div className="bg-[#f9fafb] border-l-4 border-[#e5e7eb] rounded-r-lg px-4 py-3 mb-4">
        <p className="text-sm text-[#6b7280] italic leading-relaxed">
          "{answer?.body}"
        </p>
      </div>

      {/* Footer with reply count */}
      <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6]">
        <Link
          to={`/forum/detail/${answer?.question?.id}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] hover:text-blue-600 transition-colors"
        >
          <MessageCircle
            size={18}
            className="group-hover:text-blue-600 transition-colors"
          />
          <span>{answer?.replyCount || ""} replies in thread</span>
        </Link>
      </div>
    </motion.article>
  );
}
