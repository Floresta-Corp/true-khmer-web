import { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, debounce, resolveImageURL } from "~/lib/utils";
import type {
  CourseStudentStatus,
  ListCourseStudentsResponse,
} from "~/api/education/education.server";
import {
  STUDENT_FILTERS,
  STUDENT_FILTER_LABELS,
  STUDENT_STATUS_LABELS,
  type StudentFilter,
} from "~/features/course-manage/types";
import { MANAGE_CARD } from "../overview/course-kpi-cards";
import { MessageStudentDialog } from "../students/message-student-dialog";
import { StudentProgressDialog } from "../students/student-progress-dialog";

/** The grid the design uses for both the header and the rows. */
const GRID =
  "grid grid-cols-[2fr_1.2fr_1.6fr_1fr_1.2fr_1.2fr_40px] items-center gap-5 px-5 py-4";

const STATUS_TONE: Record<CourseStudentStatus, string> = {
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
function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function percent(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

interface StudentsTabProps {
  courseId: string;
  courseTitle: string;
  /** The loader's first page, null when the roster could not be read. */
  initial: ListCourseStudentsResponse | null;
  pageSize: number;
}

/**
 * The roster.
 *
 * Filtering, search and paging all go to the server: a popular course can have
 * thousands of enrolments, and the old version filtered a full client-side
 * dump. The loader supplies page one so the first paint needs no round trip;
 * every change after that goes through a fetcher, which keeps the rest of the
 * screen mounted.
 */
export function StudentsTab({
  courseId,
  courseTitle,
  initial,
  pageSize,
}: StudentsTabProps) {
  const fetcher = useFetcher<ListCourseStudentsResponse>();
  const actionFetcher = useFetcher<{ ok: boolean; message?: string }>();

  const [filter, setFilter] = useState<StudentFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [progressFor, setProgressFor] = useState<string | null>(null);
  const [messageFor, setMessageFor] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  /* Page one comes from the loader; the fetcher owns everything after that.
     Keeping the last page visible while the next loads — dimmed, below — beats
     blanking the table on every click. */
  const data = fetcher.data ?? initial;

  const load = useMemo(() => {
    return (next: { filter: StudentFilter; search: string; page: number }) => {
      const query = new URLSearchParams();
      if (next.filter !== "all") query.set("status", next.filter);
      if (next.search) query.set("search", next.search);
      query.set("page", String(next.page));
      fetcher.load(`/course-listing/${courseId}/students?${query.toString()}`);
    };
  }, [fetcher, courseId]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 300),
    [],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  /* The loader already supplied page one, and the three pieces of state start
     at exactly the query it used — so the first render must not refetch it. */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    load({ filter, search, page });
    // Deliberately excludes `load`: it is stable per fetcher, and
    // depending on it would re-run this effect on every render.
  }, [filter, search, page]);

  /* A removal changes the roster, so the page in hand is stale. */
  useEffect(() => {
    if (actionFetcher.state === "idle" && actionFetcher.data?.ok) {
      load({ filter, search, page });
    }
  }, [actionFetcher.state, actionFetcher.data]);

  const students = data?.students ?? [];
  const counts = data?.counts ?? {
    all: 0,
    completed: 0,
    "in-progress": 0,
    "not-started": 0,
  };
  const lessonCount = data?.lessonCount ?? 0;
  const pagination = data?.pagination;
  const busy = fetcher.state !== "idle";

  const remove = (userId: string, name: string) => {
    if (
      !window.confirm(
        `Remove ${name} from ${courseTitle}? Their progress is kept, so re-enrolling restores it.`,
      )
    ) {
      return;
    }
    actionFetcher.submit(
      { intent: "remove-student", userId },
      { method: "post" },
    );
  };

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
              onClick={() => {
                setFilter(value);
                setPage(1);
              }}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                filter === value
                  ? "border-[#1C5DD4] bg-[#EFF4FE] text-[#1C5DD4]"
                  : "border-[#E5E7EB] bg-white text-[#9A9AB0] hover:border-[#C9D6F2] hover:text-[#1A1A2E]",
              )}
            >
              {STUDENT_FILTER_LABELS[value]} ({counts[value]})
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
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
              debouncedSearch(event.target.value);
            }}
            aria-label="Search students"
            placeholder="Search student..."
            className="w-full border-none bg-transparent text-[13px] text-[#333333] outline-none placeholder:text-[#9A9AB0]"
          />
        </div>
      </div>

      {actionFetcher.data?.message && (
        <p
          role="status"
          className={cn(
            "mb-3 rounded-lg px-4 py-2.5 text-[13px] font-medium",
            actionFetcher.data.ok
              ? "bg-[#E3F7ED] text-[#149A57]"
              : "bg-[#F9E7E6] text-[#C93A32]",
          )}
        >
          {actionFetcher.data.message}
        </p>
      )}

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

          <div className={cn(busy && "opacity-60 transition-opacity")}>
            {students.map((student) => (
              <div
                key={student.userId}
                className={cn(
                  GRID,
                  "border-b border-[#E5E7EB] whitespace-nowrap last:border-0",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="size-6 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                    <img
                      src={resolveImageURL(
                        student.avatar,
                        "/images/avatar_placeholder.webp",
                      )}
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
                        student.lessonsCompleted >= lessonCount &&
                          lessonCount > 0
                          ? "bg-[#4ADE80]"
                          : "bg-[#1C5DD4]",
                      )}
                      style={{
                        width: `${percent(student.lessonsCompleted, lessonCount)}%`,
                      }}
                    />
                  </span>
                  <span className="shrink-0 text-[11px] text-[#9A9AB0]">
                    {percent(student.lessonsCompleted, lessonCount)}%
                  </span>
                </span>

                <span className="truncate text-[12.5px] text-[#9A9AB0]">
                  {student.bestQuizPercent === null
                    ? "—"
                    : `${student.bestQuizPercent}%`}
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
                  {formatDate(student.completedAt)}
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
                      className="min-w-[170px] rounded-lg"
                    >
                      <DropdownMenuItem
                        onSelect={() => setProgressFor(student.userId)}
                      >
                        View progress
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          setMessageFor({
                            userId: student.userId,
                            name: student.name,
                          })
                        }
                      >
                        Message student
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-[#C93A32] focus:bg-[#F9E7E6] focus:text-[#C93A32]"
                        onSelect={() => remove(student.userId, student.name)}
                      >
                        Remove from course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </div>
            ))}
          </div>

          {students.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {busy
                  ? "Loading students…"
                  : search || filter !== "all"
                    ? "No students match this filter"
                    : "No students yet"}
              </p>
              {!busy && (
                <p className="mt-1.5 text-xs text-[#9A9AB0]">
                  {search || filter !== "all"
                    ? "Try a different search or status."
                    : `Learners who enrol in ${courseTitle} will appear here.`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-[12.5px] text-[#9A9AB0]">
            {(pagination.page - 1) * pageSize + 1}–
            {Math.min(pagination.page * pageSize, pagination.total)} of{" "}
            {pagination.total.toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || busy}
              onClick={() => setPage((current) => current - 1)}
              aria-label="Previous page"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#333333] transition-colors hover:bg-[#F9FAFC] disabled:cursor-default disabled:opacity-40"
            >
              <ChevronLeft size={15} aria-hidden />
            </button>
            <span className="text-[12.5px] font-semibold text-[#333333]">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= pagination.totalPages || busy}
              onClick={() => setPage((current) => current + 1)}
              aria-label="Next page"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#333333] transition-colors hover:bg-[#F9FAFC] disabled:cursor-default disabled:opacity-40"
            >
              <ChevronRight size={15} aria-hidden />
            </button>
          </div>
        </div>
      )}

      <StudentProgressDialog
        courseId={courseId}
        userId={progressFor}
        onClose={() => setProgressFor(null)}
      />

      <MessageStudentDialog
        student={messageFor}
        courseTitle={courseTitle}
        onClose={() => setMessageFor(null)}
      />
    </div>
  );
}
