import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { resolveImageURL } from "~/lib/utils";
import type { MyAnswerDiscussionResponse } from "~/types/api-client";
import { motion } from "motion/react";
import DeleteAnswerDialog from "~/features/forum/components/dialog/delete-answer-dialog";
import { Button } from "~/components/ui/button";
import AddAnswerDialog from "~/features/forum/components/dialog/add-answer-dialog";
import { useState } from "react";
import SlideToLeftHoverAnimation from "~/components/slide-to-left-hover-animation";

type Props = {
  answer: MyAnswerDiscussionResponse;
  index: number;
};

export default function WorkspaceAnswerItem({ answer, index = 0 }: Props) {
  const firstAnswer = answer?.answers?.[0];
  const createdAgoLabel = formatMinutesOrHoursAgo(
    firstAnswer?.createdAt ?? answer?.lastActivityAt ?? "",
  );
  const profileImage = firstAnswer?.author?.avatarKey
    ? resolveImageURL(firstAnswer.author.avatarKey)
    : "";
  const [isHovered, setIsHovered] = useState(false);
  const questionId = answer.question?.id;

  if (!firstAnswer?.id) return null;

  return (
    <motion.article
      className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:rounded-2xl sm:p-5 lg:p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => {
        setIsHovered(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.07,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Header - Author info with category and timestamp */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <Avatar className="h-10 w-10 shrink-0 border border-[#f3f4f6]">
            <AvatarImage
              src={profileImage}
              alt={firstAnswer?.author?.name || "User"}
              className="object-cover"
            />
          </Avatar>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#344256]">
              {firstAnswer?.author?.name}
            </p>
            <span className="text-[#d1d5db]">•</span>
            <span className="truncate text-sm font-semibold text-blue-600">
              {answer?.question?.category?.name || "Discussion"}
            </span>

            <span className="text-[#d1d5db]">•</span>
            <span className="text-sm text-[#9ca3af]">{createdAgoLabel}</span>
          </div>
        </div>

        {/* Edit / Delete buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="flex items-center justify-end">
            {/* <div className="flex h-[26.25px] w-[59.5px] items-center gap-1.75"> */}
            <SlideToLeftHoverAnimation isHovered={isHovered}>
              <AddAnswerDialog
                questionId={questionId}
                isEditing
                data={{
                  id: firstAnswer?.id ?? "",
                  body: firstAnswer?.body ?? "",
                }}
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
                answerId={firstAnswer?.id ?? ""}
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
            </SlideToLeftHoverAnimation>

            {/* </div> */}
          </div>
        </div>
      </div>

      {/* "Replying to" label and question title */}
      <div className="mb-3">
        <p className="mb-1.5 text-xs font-medium tracking-wide text-[#9ca3af] uppercase">
          REPLYING TO:
        </p>
        <Link
          to={`/forum/detail/${questionId}#answer-${firstAnswer?.id ?? ""}`}
          className="text-base font-semibold text-[#1f2937] transition-colors hover:text-blue-600 sm:text-lg"
        >
          {answer?.question?.title || "Question unavailable"}
        </Link>
      </div>

      {/* Answer body in quote style */}
      <div className="mb-4 rounded-r-lg border-l-4 border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
        <p className="text-sm leading-relaxed text-[#6b7280] italic">
          "{firstAnswer?.body}"
        </p>
      </div>

      {/* Footer with reply count */}
      <div className="flex items-center justify-between border-t border-[#f3f4f6] pt-3">
        <Link
          to={`/forum/detail/${questionId}#answer-${firstAnswer?.id ?? ""}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#6b7280] transition-colors hover:text-blue-600"
        >
          <MessageCircle
            size={18}
            className="transition-colors group-hover:text-blue-600"
          />
          <span>{firstAnswer?.replyCount ?? 0} replies in thread</span>
        </Link>
      </div>
    </motion.article>
  );
}
