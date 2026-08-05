import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import dayjs from "dayjs";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { resolveImageURL } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import ShareQuestionButton from "~/features/forum/components/dialog/share-question-dialog";
import QuestionVoteComponent from "~/features/forum/components/question-vote-component";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";

interface HomeDiscussionCardProps {
  question: QuestionResponse;
}

export function HomeDiscussionCard({ question }: HomeDiscussionCardProps) {
  const detailPath = `/forum/detail/${question.id}`;
  const image = question.imageKey ? resolveImageURL(question.imageKey) : null;
  const avatar = resolveImageURL(question.author.avatarKey);

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-[#e1e7ef] bg-white p-6">
      <div className="flex items-start gap-3">
        <Avatar className="size-6 shrink-0 border border-[#f3f4f6]">
          <AvatarImage
            src={avatar}
            alt={question.author.name}
            className="object-cover"
          />
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-3">
            <ProfileLinkWrapper
              authorId={question.author.id}
              className="truncate text-sm font-semibold text-[#2c2f31]"
            >
              {question.author.name}
            </ProfileLinkWrapper>
            <Link
              to={`/forum?categoryId=${question.category.id}`}
              className="truncate text-sm font-semibold text-[#1c5dd4]"
            >
              {question.category.name}
            </Link>
          </div>
          <span className="text-xs text-[#595c5e]">
            {dayjs(question.createdAt).format("MMM D, YYYY, h:mm A")}
          </span>
        </div>
      </div>

      <Link to={detailPath} className="block">
        <h3 className="line-clamp-2 text-lg leading-6.75 font-bold text-[#2c2f31] transition-colors hover:text-[#1c5dd4]">
          {question.title}
        </h3>
      </Link>

      {image ? (
        <Link to={detailPath} className="block w-full">
          <img
            src={image}
            alt=""
            className="aspect-video w-full rounded-xl object-cover"
          />
        </Link>
      ) : (
        <p className="line-clamp-4 text-sm leading-5.25 text-[#595c5e]">
          {question.body}
        </p>
      )}

      {question.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {question.tags.map((tag) => (
            <span key={tag.id} className="text-xs font-medium text-[#99a1af]">
              # {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-5 sm:gap-5">
        <QuestionVoteComponent
          question={question}
          className="shrink-0 border border-[#f3f4f6]"
        />
        <Link
          to={detailPath}
          className="flex shrink-0 items-center gap-1.5 text-xs font-bold whitespace-nowrap text-[#48566a] transition-colors hover:text-[#1c5dd4] sm:gap-2 sm:text-sm"
        >
          <MessageCircle className="size-4 sm:size-5" />
          {question.answerCount}{" "}
          {question.answerCount === 1 ? "answer" : "answers"}
        </Link>
        <ShareQuestionButton
          question={question}
          className="group inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-[#48566A] transition-colors hover:text-blue-600 sm:gap-2 sm:text-sm"
          iconClassName="size-4 sm:size-5"
        />
      </div>
    </article>
  );
}
