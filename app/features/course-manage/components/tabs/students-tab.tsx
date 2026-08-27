import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import {
  STUDENT_FILTERS,
  STUDENT_FILTER_LABELS,
  STUDENT_STATUS_LABELS,
  type ManageStudent,
  type StudentFilter,
} from "~/features/course-manage/types";
import { MANAGE_CARD } from "../overview/course-kpi-cards";

/** The grid the design uses for both the header and the rows. */
const GRID =
  "grid grid-cols-[2fr_1.2fr_1.6fr_1fr_1.2fr_1.2fr_40px] items-center gap-5 px-5 py-4";

const STATUS_TONE: Record<ManageStudent["status"], string> = {
  completed: "bg-[#E3F7ED] text-[#149A57]",
  "in-progress": "bg-[#D5E2FA] text-[#1C5DD4]",
  "not-started": "bg-[#F1F1F4] text-[#9A9AB0]",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * "02 Mar 2026". Read in UTC deliberately: the dates are stored as UTC
 * midnight, so local getters would roll them back a day west of Greenwich and
 * could disagree between the server render and the client.
 */
function formatDate(value: string) {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

interface StudentsTabProps {
  students: ManageStudent[];
  courseTitle: string;
}

export function StudentsTab({ students, courseTitle }: StudentsTabProps) {
  const [filter, setFilter] = useState<StudentFilter>("all");
  const [query, setQuery] = useState("");

  // Counts follow the search too, so they never promise rows the table is
  // filtering out.
  const matching = useMemo(() => {
    const term = query.trim().toLowerCase();
    return students.filter(
      (student) => !term || student.name.toLowerCase().includes(term),
    );
  }, [students, query]);

  const countOf = (value: StudentFilter) =>
    value === "all"
      ? matching.length
      : matching.filter((student) => student.status === value).length;

  const visible = useMemo(
    () =>
      filter === "all"
        ? matching
        : matching.filter((student) => student.status === filter),
    [matching, filter],
  );

  return (
    <div>
      <h3 className="mb-3.5 text-lg font-bold text-[#1A1A2E]">
        All enrolled students
      </h3>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {STUDENT_FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                filter === value
                  ? "border-[#1C5DD4] bg-[#EFF4FE] text-[#1C5DD4]"
                  : "border-[#E5E7EB] bg-white text-[#9A9AB0] hover:border-[#C9D6F2] hover:text-[#1A1A2E]",
              )}
            >
              {STUDENT_FILTER_LABELS[value]} ({countOf(value)})
            </button>
          ))}
        </div>

        <div className="flex w-[200px] shrink-0 items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2">
          <Search
            size={14}
            strokeWidth={2}
            aria-hidden
            className="shrink-0 text-[#9A9AB0]"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search students"
            placeholder="Search student..."
            className="w-full border-none bg-transparent text-[13px] text-[#333333] outline-none placeholder:text-[#9A9AB0]"
          />
        </div>
      </div>

      <div className={`${MANAGE_CARD} overflow-x-auto`}>
        <div className="min-w-[860px]">
          <div
            className={cn(
              GRID,
              "border-b border-[#E5E7EB] text-xs font-medium whitespace-nowrap text-[#9A9AB0]",
            )}
          >
            <span className="truncate">Student</span>
            <span className="truncate">Enrolled</span>
            <span className="truncate">Progress</span>
            <span className="truncate">Quiz score</span>
            <span className="truncate">Status</span>
            <span className="truncate">Completed</span>
            <span />
          </div>

          {visible.map((student) => (
            <div
              key={student.id}
              className={cn(
                GRID,
                "border-b border-[#E5E7EB] whitespace-nowrap last:border-0",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="size-6 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                  <img
                    src={student.avatarUrl ?? "/images/avatar_placeholder.webp"}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover"
                  />
                </span>
                <span className="truncate text-[13px] font-semibold text-[#1A1A2E]">
                  {student.name}
                </span>
              </span>

              <span className="truncate text-[12.5px] font-medium text-[#333333]">
                {formatDate(student.enrolledAt)}
              </span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-[100px] shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                  <span
                    className={cn(
                      "block h-full rounded-full",
                      student.progressPercent >= 100
                        ? "bg-[#4ADE80]"
                        : "bg-[#1C5DD4]",
                    )}
                    style={{ width: `${student.progressPercent}%` }}
                  />
                </span>
                <span className="shrink-0 text-[11px] text-[#9A9AB0]">
                  {student.progressPercent}%
                </span>
              </span>

              <span className="truncate text-[12.5px] text-[#9A9AB0]">
                {student.quizScore}
              </span>

              <span className="flex">
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap",
                    STATUS_TONE[student.status],
                  )}
                >
                  {STUDENT_STATUS_LABELS[student.status]}
                </span>
              </span>

              <span
                className={cn(
                  "truncate text-[12.5px]",
                  student.status === "completed"
                    ? "font-medium text-[#1A1A2E]"
                    : "text-[#9A9AB0]",
                )}
              >
                {student.completedLabel}
              </span>

              <span className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Actions for ${student.name}`}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-md text-[#9A9AB0] transition-colors hover:bg-[#F9FAFC]"
                  >
                    <span aria-hidden className="text-base leading-none">
                      ⋮
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-[140px] rounded-lg"
                  >
                    <DropdownMenuItem>View progress</DropdownMenuItem>
                    <DropdownMenuItem>Message student</DropdownMenuItem>
                    <DropdownMenuItem>Remove from course</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </span>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[#1A1A2E]">
                No students yet
              </p>
              <p className="mt-1.5 text-xs text-[#9A9AB0]">
                Learners who enrol in {courseTitle} will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
