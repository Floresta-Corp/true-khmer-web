import {
  ArrowBigUp,
  Eye,
  MessageCircle,
  MessageSquareText,
} from "lucide-react";
import { Link } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn, resolveImageURL } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";

const MAX_VISIBLE_TAGS = 3;

const STATUS_STYLES: Record<QuestionResponse["status"], string> = {
  PUBLISHED: "",
  CLOSED:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  DELETED:
    "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  SUSPENDED:
    "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20",
};

const compact = new Intl.NumberFormat("en", { notation: "compact" });

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1 text-slate-500 ring-1 ring-slate-100 ring-inset dark:bg-slate-800/60 dark:text-slate-400 dark:ring-slate-800"
      title={`${value} ${label}`}
    >
      {icon}
      <span className="text-xs font-semibold tabular-nums">
        {compact.format(value)}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

interface ManageForumQuestionRowProps {
  question: QuestionResponse;
  actions?: React.ReactNode;
}

export default function ManageForumQuestionRow({
  question,
  actions,
}: ManageForumQuestionRowProps) {
  const thumbnail = question.imageKey
    ? resolveImageURL(question.imageKey)
    : null;
  const hiddenTagCount = question.tags.length - MAX_VISIBLE_TAGS;
  const detailPath = `/tk-admin/manage-forum/${question.id}`;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_-12px_rgb(15_23_42/0.18)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start gap-4 p-4">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            className="hidden size-20 shrink-0 rounded-xl bg-slate-100 object-cover sm:block dark:bg-slate-800"
          />
        ) : (
          <div
            aria-hidden="true"
            className="hidden size-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 sm:flex dark:bg-slate-800 dark:text-slate-500"
          >
            <MessageSquareText size={26} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <Link
                to={`/tk-admin/manage-forum?categoryId=${question.category.id}`}
                className="relative z-10 max-w-40 truncate rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {question.category.name}
              </Link>

              {question.status !== "PUBLISHED" && (
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
                    STATUS_STYLES[question.status],
                  )}
                >
                  {question.status}
                </span>
              )}
            </div>

            <div className="relative z-10 flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
              {actions}
            </div>
          </div>

          <h3 className="mt-2">
            <Link
              to={detailPath}
              className="line-clamp-1 text-[15px] font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
            >
              <span className="absolute inset-0 z-0" aria-hidden="true" />
              {question.title}
            </Link>
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5.5 text-slate-500 dark:text-slate-400">
            {question.body}
          </p>

          {question.status === "SUSPENDED" && (
            <p className="relative z-10 mt-2 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
              On moderation hold
              {question.suspensionReason
                ? ` — ${question.suspensionReason}`
                : " — no reason given"}
            </p>
          )}

          {question.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {question.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200 ring-inset dark:text-slate-500 dark:ring-slate-800"
                >
                  #{tag.name}
                </span>
              ))}
              {hiddenTagCount > 0 && (
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  +{hiddenTagCount}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex min-w-0 items-center gap-2 text-xs">
              <Avatar className="size-6 shrink-0 border border-slate-100 dark:border-slate-800">
                <AvatarImage
                  src={resolveImageURL(question.author.avatarKey)}
                  alt={question.author.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px]">
                  {question.author.name.trim().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="max-w-40 truncate font-semibold text-slate-700 dark:text-slate-200">
                {question.author.name}
              </span>
              <span aria-hidden="true" className="text-slate-300">
                •
              </span>
              <span className="whitespace-nowrap text-slate-400 dark:text-slate-500">
                {formatMinutesOrHoursAgo(question.createdAt)}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <Stat
                icon={<ArrowBigUp size={14} />}
                value={question.score}
                label="score"
              />
              <Stat
                icon={<MessageCircle size={13} />}
                value={question.answerCount}
                label="answers"
              />
              <Stat
                icon={<Eye size={13} />}
                value={question.viewCount}
                label="views"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
