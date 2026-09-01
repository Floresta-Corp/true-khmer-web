import { Check, Star } from "lucide-react";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseDetail } from "~/features/education/types";

export function CourseOverviewTab({ course }: { course: CourseDetail }) {
  return (
    <div className={`${CARD} px-6 pt-7 pb-8 sm:px-7.5`}>
      <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-5 border-b border-gray-200 pb-5">
        {course.meta.map((item) => (
          <div key={item.label}>
            <dt className="mb-1.5 text-[11px] font-bold tracking-[0.06em] text-[#9A9AB0]">
              {item.label}
            </dt>
            <dd className="flex items-center gap-1.25 text-base font-semibold text-[#1A1A2E]">
              {item.isRating && (
                <Star
                  className="size-4 fill-amber-400 text-amber-400"
                  aria-hidden
                />
              )}
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mb-6.5 text-base leading-[1.65] text-pretty text-[#9A9AB0]">
        {course.description}
      </p>

      {/* Only shown when the creator actually listed skills in the builder. */}
      {course.outcomes.length > 0 && (
        <>
          <h2 className="mb-3.5 text-xl font-bold text-[#1A1A2E]">
            What you&apos;ll learn
          </h2>
          <ul className="flex flex-col gap-2.5">
            {course.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start gap-2.5 text-sm text-[#333333]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[#1FC16B]"
                  aria-hidden
                />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
