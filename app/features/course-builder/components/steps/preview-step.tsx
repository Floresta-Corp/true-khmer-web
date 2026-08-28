import {
  BookOpen,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  PlayCircle,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { DIFFICULTY_OPTIONS } from "~/features/course-builder/types";
import type {
  BuilderStep,
  CategoryOption,
  CourseDraft,
} from "~/features/course-builder/types";
import type { CourseSection } from "~/features/education/types";

const CARD = "rounded-xl border border-[#E5E7EB] bg-white px-[26px] py-6";
const FIELD_LABEL =
  "mb-[5px] text-[11px] font-bold tracking-[0.04em] text-[#9A9AB0]";

interface PreviewStepProps {
  draft: CourseDraft;
  categories: CategoryOption[];
  sections: CourseSection[];
  questionCount: number;
  passMark: string;
  onEditStep: (step: BuilderStep) => void;
}

export function PreviewStep({
  draft,
  categories,
  sections,
  questionCount,
  passMark,
  onEditStep,
}: PreviewStepProps) {
  const lessonCount = sections.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );
  const categoryLabel =
    categories.find((category) => category.value === draft.categoryId)?.label ??
    "Not set";
  const difficultyLabel =
    DIFFICULTY_OPTIONS.find((option) => option.value === draft.difficulty)
      ?.label ?? "Not set";

  const checklist: Array<{ label: string; done: boolean; step: BuilderStep }> =
    [
      {
        label: "Course title and description",
        done:
          draft.title.trim().length > 0 && draft.description.trim().length > 0,
        step: "basic",
      },
      {
        label: "Category chosen",
        done: Boolean(draft.categoryId),
        step: "basic",
      },
      {
        label: "At least one lesson",
        done: lessonCount > 0,
        step: "curriculum",
      },
      { label: "Quiz questions added", done: questionCount > 0, step: "quiz" },
    ];

  const done = checklist.filter((item) => item.done).length;

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[1fr_280px]">
      <div className="order-2 flex min-w-0 flex-col gap-5 xl:order-1">
        <ReviewCard
          title="Course details"
          done={checklist[0].done && checklist[1].done}
          onEdit={() => onEditStep("basic")}
        >
          <div className="mb-[18px] grid gap-[18px_28px] sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className={FIELD_LABEL}>TITLE</div>
              <div className="text-[15px] font-bold text-[#1A1A2E]">
                {draft.title || "Not set"}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className={FIELD_LABEL}>DESCRIPTION</div>
              <div className="text-wrap-pretty text-sm leading-[1.55] text-[#333333]">
                {draft.description || "Not set"}
              </div>
            </div>
            <div>
              <div className={FIELD_LABEL}>LEVEL</div>
              <div className="text-sm font-semibold text-[#1A1A2E]">
                {difficultyLabel}
              </div>
            </div>
            <div>
              <div className={FIELD_LABEL}>CATEGORY</div>
              <div className="text-sm font-semibold text-[#1A1A2E]">
                {categoryLabel}
              </div>
            </div>
          </div>

          {draft.coverPreviewUrl && (
            <div className="border-t border-[#E5E7EB] pt-4">
              <div className={FIELD_LABEL}>COVER</div>
              <img
                src={draft.coverPreviewUrl}
                alt=""
                className="h-24 w-40 rounded-lg object-cover"
              />
            </div>
          )}
        </ReviewCard>

        <ReviewCard
          title="Curriculum"
          done={lessonCount > 0}
          onEdit={() => onEditStep("curriculum")}
        >
          <div className="flex flex-wrap gap-10">
            <Stat
              icon={BookOpen}
              value={sections.length}
              label={sections.length === 1 ? "Chapter" : "Chapters"}
            />
            <Stat
              icon={PlayCircle}
              value={lessonCount}
              label={lessonCount === 1 ? "Lesson" : "Lessons"}
            />
          </div>
        </ReviewCard>

        <ReviewCard
          title="Skills learners will gain"
          done={draft.skills.length > 0}
          onEdit={() => onEditStep("basic")}
        >
          {draft.skills.length === 0 ? (
            <p className="text-[13px] text-[#9A9AB0]">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {draft.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#D5E2FA] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#1C5DD4]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </ReviewCard>

        {questionCount > 0 && (
          <ReviewCard title="Quizzes" done onEdit={() => onEditStep("quiz")}>
            <div className="flex flex-wrap gap-10">
              <div>
                <div className="text-xl font-bold text-[#1A1A2E]">
                  {questionCount}
                </div>
                <div className="text-[13px] text-[#9A9AB0]">
                  Total questions
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#1A1A2E]">
                  {passMark}%
                </div>
                <div className="text-[13px] text-[#9A9AB0]">Passing score</div>
              </div>
            </div>
          </ReviewCard>
        )}
      </div>

      <div className="order-1 min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-4 xl:order-2">
        <h3 className="mb-[3px] text-sm font-bold text-[#1A1A2E]">
          Ready to submit?
        </h3>
        <div className="mb-1.5 text-[11px] font-semibold text-[#9A9AB0]">
          {done} of {checklist.length} complete
        </div>
        <div className="mb-3.5 h-[5px] overflow-hidden rounded-full bg-[#E8E8E8]">
          <div
            className="h-full rounded-full bg-[#1C5DD4] transition-[width]"
            style={{ width: `${(done / checklist.length) * 100}%` }}
          />
        </div>

        <div className="mb-3.5 flex flex-col gap-0.5">
          {checklist.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onEditStep(item.step)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-2 text-left transition-colors hover:bg-[#F5F5F5]"
            >
              {item.done ? (
                <CircleCheck
                  size={16}
                  aria-hidden
                  className="shrink-0 text-[#1FC16B]"
                />
              ) : (
                <CircleDashed
                  size={16}
                  aria-hidden
                  className="shrink-0 text-[#9A9AB0]"
                />
              )}
              <span
                className={cn(
                  "min-w-0 flex-1 text-[12.5px] font-semibold",
                  item.done ? "text-[#1A1A2E]" : "text-[#9A9AB0]",
                )}
              >
                {item.label}
              </span>
              <ChevronRight
                size={14}
                aria-hidden
                className="shrink-0 text-[#9A9AB0]"
              />
            </button>
          ))}
        </div>

        <p className="mt-1 text-[11px] text-[#9A9AB0]">
          A reviewer checks your course before it goes live. You can keep
          editing while it is in review.
        </p>
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  done,
  onEdit,
  children,
}: {
  title: string;
  done: boolean;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={CARD}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {done ? (
            <CircleCheck
              size={22}
              aria-hidden
              className="shrink-0 text-[#1FC16B]"
            />
          ) : (
            <CircleDashed
              size={22}
              aria-hidden
              className="shrink-0 text-[#9A9AB0]"
            />
          )}
          <h3 className="text-[17px] font-bold text-[#1A1A2E]">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 cursor-pointer rounded-lg border border-[#1C5DD4] px-4 py-[7px] text-[13px] font-bold text-[#1C5DD4]"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BookOpen;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} aria-hidden className="text-[#9A9AB0]" />
      <span className="text-base font-bold text-[#1A1A2E]">{value}</span>
      <span className="text-[13px] text-[#9A9AB0]">{label}</span>
    </div>
  );
}
