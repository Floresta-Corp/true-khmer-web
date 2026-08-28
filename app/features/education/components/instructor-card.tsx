import { Mail, Phone } from "lucide-react";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseInstructor } from "~/features/education/types";

export function InstructorCard({
  instructor,
}: {
  instructor: CourseInstructor;
}) {
  return (
    <div className={`${CARD} p-6`}>
      <p className="mb-3.5 text-sm font-semibold text-[#9A9AB0]">Posted by</p>
      <div className="flex items-center gap-3.5">
        <span className="size-11.5 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
          <img
            src={instructor.avatarUrl ?? "/images/avatar_placeholder.webp"}
            alt=""
            className="size-full object-cover object-top"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-[#1A1A2E]">
            {instructor.name}
          </p>
          <p className="text-xs text-[#9A9AB0]">
            {instructor.coursesPublished} courses published
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#contact"
            aria-label={`Call ${instructor.name}`}
            className="flex size-10 items-center justify-center rounded-[10px] border border-gray-200 bg-white transition-colors hover:border-[#1C5DD4]"
          >
            <Phone className="size-4.25 text-[#1A1A2E]" aria-hidden />
          </a>
          <a
            href="#contact"
            aria-label={`Email ${instructor.name}`}
            className="flex size-10 items-center justify-center rounded-[10px] border border-gray-200 bg-white transition-colors hover:border-[#1C5DD4]"
          >
            <Mail className="size-4.25 text-[#1A1A2E]" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
