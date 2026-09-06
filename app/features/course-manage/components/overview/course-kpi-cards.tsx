import { CheckCircle2, Clock, Star, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  MANAGE,
  type CourseManageOverview,
} from "~/features/course-manage/types";

export const MANAGE_CARD =
  "rounded-xl bg-white shadow-[0_1px_3px_rgba(26,26,46,0.06),0_8px_24px_rgba(26,26,46,0.04)]";

/**
 * The four Overview stat cards: a 38px tinted icon square beside a 13px label,
 * then a 26px figure and a 12.5px sub-label, per the design's `teachStatCards`.
 *
 * A metric nothing records shows an em dash in muted ink and says so in the
 * sub-label, so an untracked figure never reads as a bad one.
 */
export function CourseKpiCards({
  overview,
}: {
  overview: CourseManageOverview;
}) {
  const cards = [
    {
      label: "Enrollments",
      value: overview.enrollments.toLocaleString(),
      subLabel: "Total learners",
      icon: Users,
      iconBg: MANAGE.primary100,
      iconColor: MANAGE.brand,
    },
    {
      label: "Completion rate",
      value: `${overview.completionRate}%`,
      subLabel: `${overview.lessonCount} lessons`,
      icon: CheckCircle2,
      iconBg: "rgba(31,193,107,0.12)",
      iconColor: MANAGE.success,
    },
    {
      label: "Quiz pass rate",
      value: overview.quizPassRate === null ? "—" : `${overview.quizPassRate}%`,
      subLabel:
        overview.avgQuizScore === null
          ? "Attempts are not recorded yet"
          : `Avg score ${overview.avgQuizScore}%`,
      muted: overview.quizPassRate === null,
      icon: Clock,
      iconBg: "rgba(50,168,255,0.14)",
      iconColor: MANAGE.accent,
    },
    {
      label: "Rating",
      value: overview.rating === null ? "—" : overview.rating.toFixed(1),
      subLabel:
        overview.rating === null
          ? "No reviews yet"
          : `${overview.reviewCount.toLocaleString()} reviews`,
      muted: overview.rating === null,
      icon: Star,
      iconBg: "rgba(225,113,0,0.12)",
      iconColor: MANAGE.warning,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`${MANAGE_CARD} px-[22px] py-5`}>
            <div className="mb-3.5 flex items-center gap-3">
              <span
                className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: card.iconBg, color: card.iconColor }}
              >
                <Icon size={19} strokeWidth={2} aria-hidden />
              </span>
              <span className="truncate text-[13px] font-semibold text-[#9A9AB0]">
                {card.label}
              </span>
            </div>
            <div
              className={cn(
                "mb-1.5 text-[26px] leading-none font-extrabold",
                card.muted ? "text-[#C6C6D4]" : "text-[#1A1A2E]",
              )}
            >
              {card.value}
            </div>
            <div className="text-[12.5px] text-[#9A9AB0]">{card.subLabel}</div>
          </div>
        );
      })}
    </div>
  );
}
