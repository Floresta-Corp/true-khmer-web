import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { resolveImageURL } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";

interface HomeDiscussionCardProps {
  question: QuestionResponse;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function HomeDiscussionCard({ question }: HomeDiscussionCardProps) {
  const detailPath = `/forum/detail/${question.id}`;
  const avatar = resolveImageURL(question.author.avatarKey);

  return (
    <article className="group relative flex items-center gap-3 rounded-xl border border-[#e1e7ef] bg-white px-4 py-3.5 transition-colors focus-within:border-[#2f6fe4] hover:border-[#2f6fe4] sm:gap-4 sm:px-5">
      <Avatar className="size-9 shrink-0 sm:size-10">
        <AvatarImage
          src={avatar}
          alt={question.author.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-[#1c5dd4] text-xs font-semibold text-white">
          {getInitials(question.author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-col gap-1">
        <Link
          to={detailPath}
          className="block cursor-pointer after:absolute after:inset-0 after:content-[''] focus:outline-none"
        >
          <h3 className="truncate text-[16px] font-bold text-[#1e293b] transition-colors group-hover:text-[#1c5dd4] sm:text-base">
            {question.title}
          </h3>
        </Link>
        <p className="flex min-w-0 items-center gap-1 truncate text-xs text-[#595c5e] sm:text-sm">
          <ProfileLinkWrapper
            authorId={question.author.id}
            className="relative z-10 truncate font-medium text-[#2c2f31] hover:text-[#1c5dd4]"
          >
            {question.author.name}
          </ProfileLinkWrapper>
          <span className="shrink-0">in</span>
          <Link
            to={`/forum?categoryId=${question.category.id}`}
            className="relative z-10 truncate font-semibold text-[#1c5dd4]"
          >
            {question.category.name}
          </Link>
          <span className="shrink-0 text-[#99a1af]">·</span>
          <span className="shrink-0">
            {question.answerCount}{" "}
            {question.answerCount === 1 ? "answer" : "answers"}
          </span>
        </p>
      </div>
    </article>
  );
}
