import {
  ChevronDown,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import AddAnswerDialog from "~/features/forum/components/dialog/add-answer-dialog";
import DeleteAnswerDialog from "~/features/forum/components/dialog/delete-answer-dialog";
import type { GetMyAnswersResponse } from "~/types/api-client";

type Discussion = GetMyAnswersResponse["discussions"][number];
type DiscussionQuestion = Discussion["question"];
type DiscussionAnswer = Discussion["answers"][number];

type Props = {
  discussion: Discussion;
  index?: number;
};

/**
 * Shared style for an answer-body link: underlined, hover blue. The trailing
 * `!` forces blue over `AccordionContent`'s `[&_a]:hover:text-foreground`,
 * keeping single- and multi-answer layouts visually consistent.
 */
const ANSWER_BODY_LINK_CLASS =
  "block text-sm leading-relaxed text-[#4b5563] underline underline-offset-3 hover:text-blue-600! transition-colors";

/** Relative time including days/weeks (e.g. "3 days ago"). */
function timeAgo(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

/** Icon tile + question title + category badge — shared across layouts. */
function DiscussionHeading({ question }: { question: DiscussionQuestion }) {
  const navigate = useNavigate();
  const href = `/forum/detail/${question.id}`;

  const goToDiscussion = (e: React.SyntheticEvent) => {
    // Prevent the click from toggling the surrounding accordion trigger.
    e.stopPropagation();
    navigate(href);
  };

  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold leading-none text-[#1A73E8]">
        ?
      </span>
      <span className="min-w-0 flex-1">
        <span
          role="link"
          tabIndex={0}
          onClick={goToDiscussion}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToDiscussion(e);
            }
          }}
          className="block w-fit cursor-pointer text-base font-semibold text-[#1f2937] hover:text-blue-600 hover:underline transition-colors"
        >
          {question.title}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-sm text-[#9ca3af]">
          in
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
            {question.category?.name ?? "Discussion"}
          </span>
        </span>
      </span>
    </>
  );
}

/** Edit / delete menu for one answer. */
function AnswerActionsMenu({
  answer,
  questionId,
}: {
  answer: DiscussionAnswer;
  questionId: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Answer options"
          className="cursor-pointer shrink-0 rounded-lg p-1 text-[#99a1af] outline-none hover:bg-[#f1f5f9] hover:text-[#344256] focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <MoreVertical size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <AddAnswerDialog
            questionId={questionId}
            isEditing
            data={{ id: answer.id, body: answer.body }}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Pencil size={14} />
                Edit answer
              </DropdownMenuItem>
            }
          />
          <DeleteAnswerDialog
            answerId={answer.id}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 size={14} />
                Delete answer
              </DropdownMenuItem>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AnswerRow({
  answer,
  questionId,
}: {
  answer: DiscussionAnswer;
  questionId: string;
}) {
  return (
    <li className="relative pl-6">
      {/* Timeline dot */}
      <span className="absolute left-0 top-1.5 size-2.5 rounded-full bg-blue-500 ring-4 ring-white" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-semibold text-[#344256]">You</span>{" "}
            <span className="text-[#9ca3af]">
              replied {timeAgo(answer.createdAt)}
            </span>
          </p>
          <Link
            to={`/forum/detail/${questionId}#answer-${answer.id}`}
            className={`mt-1 line-clamp-1 ${ANSWER_BODY_LINK_CLASS}`}
          >
            {answer.body}
          </Link>
        </div>

        <AnswerActionsMenu answer={answer} questionId={questionId} />
      </div>
    </li>
  );
}

/** Footer link to the full forum thread. */
function ViewFullDiscussion({ questionId }: { questionId: string }) {
  return (
    <Link
      to={`/forum/detail/${questionId}`}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
    >
      View full discussion
      <ExternalLink size={14} />
    </Link>
  );
}

export default function WorkspaceDiscussionCard({
  discussion,
  index = 0,
}: Props) {
  const { question, answers } = discussion;
  const questionId = question.id;
  const itemValue = `discussion-${questionId}`;
  const [openValue, setOpenValue] = useState("");
  const isOpen = openValue === itemValue;

  if (!answers?.length) return null;

  const wrapperProps = {
    className: "w-full rounded-2xl border border-slate-200 bg-white",
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.3,
      delay: index * 0.07,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  };

  // ── Single answer — static card, no accordion ────────────────────────────
  if (answers.length === 1) {
    const answer = answers[0];
    return (
      <motion.article {...wrapperProps}>
        <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
          <DiscussionHeading question={question} />
        </div>

        <div className="px-4 sm:px-6">
          <div className="rounded-xl border border-slate-100 bg-[#fafbfc] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm">
                <span className="font-semibold text-[#344256]">
                  Your posted answer
                </span>
                <span className="mx-1.5 text-[#d1d5db]">•</span>
                <span className="text-[#9ca3af]">
                  {timeAgo(answer.createdAt)}
                </span>
              </p>
              <AnswerActionsMenu answer={answer} questionId={questionId} />
            </div>
            <Link
              to={`/forum/detail/${questionId}#answer-${answer.id}`}
              className={`mt-2 ${ANSWER_BODY_LINK_CLASS}`}
            >
              {answer.body}
            </Link>
          </div>

          <div className="mt-4 border-t border-slate-100 py-4">
            <ViewFullDiscussion questionId={questionId} />
          </div>
        </div>
      </motion.article>
    );
  }

  // ── Multiple answers — collapsible timeline ───────────────────────────────
  return (
    <motion.article {...wrapperProps}>
      <Accordion
        type="single"
        collapsible
        value={openValue}
        onValueChange={setOpenValue}
      >
        <AccordionItem value={itemValue} className="border-b-0">
          {/* Header — acts as the accordion trigger */}
          <AccordionTrigger className="items-center gap-3 px-4 py-4 hover:no-underline sm:px-6">
            <DiscussionHeading question={question} />
          </AccordionTrigger>

          <AccordionContent className="px-4 pb-0 sm:px-6">
            <div className="border-t border-slate-100 pt-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                Your answers in this discussion
              </p>

              <ul className="relative space-y-5">
                {/* Connecting line behind the timeline dots */}
                <span className="absolute left-1.25 top-2 bottom-2 w-px bg-slate-200" />
                {answers.map((answer) => (
                  <AnswerRow
                    key={answer.id}
                    answer={answer}
                    questionId={questionId}
                  />
                ))}
              </ul>

              <div className="mt-4 border-t border-slate-100 py-4">
                <ViewFullDiscussion questionId={questionId} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Collapsed-state footer — shown when there are multiple answers */}
      {!isOpen && (
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:px-6">
          <p className="text-sm text-[#9ca3af]">
            Your posted answer is saved in this discussion thread.
          </p>
          <button
            type="button"
            onClick={() => setOpenValue(itemValue)}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View your answer
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </motion.article>
  );
}
