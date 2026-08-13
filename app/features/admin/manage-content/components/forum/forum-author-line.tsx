import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn, resolveImageURL } from "~/lib/utils";
import type { AnswerResponse } from "~/types/api-client";

function initialsOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

interface ForumAuthorLineProps {
  author: AnswerResponse["author"];
  createdAt: string;
  isQuestionAuthor: boolean;
  size?: "sm" | "md";
}

export default function ForumAuthorLine({
  author,
  createdAt,
  isQuestionAuthor,
  size = "md",
}: ForumAuthorLineProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar
        className={cn(
          "shrink-0 border border-slate-100 dark:border-slate-800",
          size === "md" ? "size-9" : "size-7",
        )}
      >
        <AvatarImage
          src={resolveImageURL(author.avatarKey)}
          alt={author.name}
          className="object-cover"
        />
        <AvatarFallback className="text-xs">
          {initialsOf(author.name)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "truncate font-semibold text-slate-900 dark:text-white",
              size === "md" ? "text-sm" : "text-[13px]",
            )}
          >
            {author.name}
          </span>
          {isQuestionAuthor && (
            <Badge
              variant="secondary"
              className="pointer-events-none shrink-0 bg-emerald-50 px-1.5 py-0 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            >
              OP
            </Badge>
          )}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {formatMinutesOrHoursAgo(createdAt)}
        </span>
      </div>
    </div>
  );
}
