import { Link } from "react-router";
import { motion } from "motion/react";
import { MoreVertical, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import { CourseActionsMenu } from "./course-actions-menu";
import { CourseStatusBadge } from "./course-status-badge";
import {
  displayStatusOf,
  type CourseWithStats,
} from "~/features/course-listing/types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "2 July 2026", as the card writes it — no zero padding, full month name.
 * Read in UTC so the day does not shift west of Greenwich or disagree between
 * the server render and the client.
 */
function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * One course as a grid tile: a 16:9 cover carrying the status pill and the
 * overflow menu, then the title, a learners-and-date line, and the three
 * engagement figures divided by vertical rules.
 */
export function CourseListingCard({
  course,
  index,
}: {
  course: CourseWithStats;
  index: number;
}) {
  const status = displayStatusOf(course);
  const cover = course.coverImageUrl ?? "/placeholder/images.svg";
  const dated = course.publishedAt ?? course.createdAt;
  const { stats } = course;

  const figures = [
    { label: "Completed", percent: stats?.completed.percent ?? 0 },
    { label: "In progress", percent: stats?.inProgress.percent ?? 0 },
    { label: "Not started", percent: stats?.notStarted.percent ?? 0 },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: Math.min(index, 6) * 0.03 }}
      className="group @container relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(26,26,46,0.14),0_2px_6px_rgba(26,26,46,0.06)]"
    >
      {/* 2:1, not the 16:9 the builder previews at — measured off the design,
          where the cover is appreciably wider than it is tall. `object-cover`
          therefore trims a little from the top and bottom of what the creator
          framed. */}
      <div className="relative aspect-[2/1] shrink-0 overflow-hidden bg-[#E8E8E8]">
        <img
          src={cover}
          alt=""
          loading="lazy"
          className={
            course.coverImageUrl
              ? "size-full object-cover"
              : "size-full object-contain p-8"
          }
        />

        <CourseStatusBadge
          status={status}
          variant="overlay"
          className="absolute top-3.5 left-3.5"
        />

        {/* Faint until the card is hovered or the trigger is focused, so the
            cover stays the loudest thing on the tile. */}
        <CourseActionsMenu
          course={course}
          triggerClassName="absolute top-3 right-3 size-8 rounded-lg bg-black/25 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:bg-black/45 focus-visible:opacity-100 data-[state=open]:opacity-100"
          triggerIcon={<MoreVertical size={17} aria-hidden />}
        />
      </div>

      {/* Sized against the card, not the viewport: at four columns a tile is
          ~265px and needs the compact scale, while two or three columns give it
          the room for the design's larger type. */}
      <div className="flex flex-1 flex-col p-4 @min-[300px]:px-5 @min-[300px]:pt-5 @min-[300px]:pb-5">
        <h3 className="mb-2.5 line-clamp-2 text-[17px] leading-[1.3] font-extrabold text-[#10101E] @min-[300px]:mb-3 @min-[300px]:text-[20px] @min-[300px]:leading-[1.25]">
          <Link
            to={`/course-listing/${course.id}`}
            className="rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#305CCD]"
          >
            {course.title}
          </Link>
        </h3>

        <p className="mb-3.5 flex items-center gap-1.5 text-[13px] text-[#86869E] @min-[300px]:mb-[18px] @min-[300px]:gap-2 @min-[300px]:text-[14.5px]">
          <Users size={15} strokeWidth={1.9} aria-hidden className="shrink-0" />
          <span>
            <span className="font-bold text-[#10101E]">
              {(stats?.totalLearners ?? 0).toLocaleString()}
            </span>{" "}
            learners · {formatDate(dated)}
          </span>
        </p>

        <dl className="mt-auto grid grid-cols-3 border-t border-[#E5E7EB] pt-3.5 @min-[300px]:pt-[18px]">
          {figures.map((figure, position) => (
            <div
              key={figure.label}
              className={cn(
                "text-center",
                position > 0 && "border-l border-[#E5E7EB]",
              )}
            >
              <dd className="text-[18px] leading-none font-extrabold text-[#10101E] @min-[300px]:text-[21px]">
                {figure.percent}%
              </dd>
              <dt className="mt-1.5 text-[11.5px] whitespace-nowrap text-[#86869E] @min-[300px]:text-[13.5px]">
                {figure.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </motion.article>
  );
}
