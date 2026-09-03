import {
  ArrowLeft,
  Award,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Info,
  Mail,
  Tag,
  UserRound,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";

import DetailPanel from "~/features/admin/components/detail-panel";
import DetailRow from "~/features/admin/components/detail-row";
import { CourseStatusBadge } from "~/features/course-listing/components/course-status-badge";
import { displayStatusOf } from "~/features/course-listing/types";
import { formatDateTime } from "~/lib/time";
import {
  CERTIFICATE_LABELS,
  DIFFICULTY_LABELS,
} from "~/features/admin/manage-education/types";
import { useCourseReview } from "../../hooks/use-course-review";
import CourseReviewContentPanels from "../course-review-content";
import type { manageEducationDetailLoader } from "../../services/manage-education-detail.loader";
import ApproveCourseDialog from "../approve-course-dialog";
import CoursePublicationDialog from "../course-publication-dialog";
import RejectCourseDialog from "../reject-course-dialog";

export default function ManageEducationDetailPage() {
  const { course, categoryName, creator, review } =
    useLoaderData<typeof manageEducationDetailLoader>();

  const { decidedStatuses, approve, reject, publish, unpublish, isReviewing } =
    useCourseReview();

  const status = decidedStatuses.get(course.id) ?? course.status;
  const displayStatus = displayStatusOf({ ...course, status });

  const canPreview = status === "PUBLISHED";

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/tk-admin/manage-education"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to education management
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {canPreview && (
                <Link
                  to={`/education/${course.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  <ExternalLink size={14} />
                  View live course
                </Link>
              )}

              {status === "PENDING" && (
                <>
                  <RejectCourseDialog
                    courseId={course.id}
                    courseTitle={course.title}
                    onConfirm={reject}
                    disabled={isReviewing}
                  />
                  <ApproveCourseDialog
                    courseId={course.id}
                    courseTitle={course.title}
                    onConfirm={approve}
                    disabled={isReviewing}
                  />
                </>
              )}

              {(status === "PUBLISHED" || status === "UNPUBLISHED") && (
                <CoursePublicationDialog
                  courseId={course.id}
                  courseTitle={course.title}
                  published={status === "PUBLISHED"}
                  onPublish={publish}
                  onUnpublish={unpublish}
                  disabled={isReviewing}
                />
              )}
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="relative aspect-[21/9] w-full bg-slate-100 dark:bg-slate-800">
              {course.coverImageUrl ? (
                <img
                  src={course.coverImageUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-slate-300 dark:text-slate-600">
                  <GraduationCap size={44} />
                </span>
              )}
            </div>

            <div className="p-5">
              <CourseStatusBadge status={displayStatus} />
              <h1 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                {course.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">
                {course.description}
              </p>
            </div>
          </section>

          {course.rejectionNote && (
            <div
              role="note"
              className="rounded-2xl border border-red-200 bg-red-50/70 p-5 dark:border-red-500/30 dark:bg-red-500/10"
            >
              <p className="text-xs font-bold tracking-wide text-red-600 uppercase dark:text-red-400">
                Previously rejected
                {course.rejectedAt
                  ? ` · ${formatDateTime(course.rejectedAt)}`
                  : ""}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {course.rejectionNote}
              </p>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <DetailPanel title="Course">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <DetailRow
                  icon={<Tag size={13} />}
                  label="Category"
                  value={categoryName ?? "Uncategorised"}
                />
                <DetailRow
                  icon={<UserRound size={13} />}
                  label="Created by"
                  value={
                    <Link
                      to={`/tk-admin/user/${course.createdBy}`}
                      className="text-sky-600 hover:underline dark:text-sky-400"
                    >
                      {creator?.name ?? "Unknown creator"}
                    </Link>
                  }
                />
                {creator?.email && (
                  <DetailRow
                    icon={<Mail size={13} />}
                    label="Email"
                    value={creator.email}
                  />
                )}
                <DetailRow
                  icon={<GraduationCap size={13} />}
                  label="Difficulty"
                  value={
                    review.difficulty
                      ? DIFFICULTY_LABELS[review.difficulty]
                      : "Not set"
                  }
                />
                <DetailRow
                  icon={<Award size={13} />}
                  label="Certificate"
                  value={
                    review.certificateKind
                      ? CERTIFICATE_LABELS[review.certificateKind]
                      : "None"
                  }
                />
              </div>
            </DetailPanel>

            <DetailPanel title="Timeline">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <DetailRow
                  icon={<CalendarDays size={13} />}
                  label="Created"
                  value={formatDateTime(course.createdAt)}
                />
                <DetailRow
                  icon={<CalendarDays size={13} />}
                  label="Last updated"
                  value={formatDateTime(course.updatedAt)}
                />
                {course.publishedAt && (
                  <DetailRow
                    icon={<CalendarDays size={13} />}
                    label="Published"
                    value={formatDateTime(course.publishedAt)}
                  />
                )}
                {course.unpublishedAt && (
                  <DetailRow
                    icon={<CalendarDays size={13} />}
                    label="Unpublished"
                    value={formatDateTime(course.unpublishedAt)}
                  />
                )}
              </div>
            </DetailPanel>
          </div>

          {(review.skills.length > 0 || review.tags.length > 0) && (
            <div className="grid gap-4 lg:grid-cols-2">
              {review.skills.length > 0 && (
                <DetailPanel title="Skills gained">
                  <div className="flex flex-wrap gap-1.5">
                    {review.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </DetailPanel>
              )}

              {review.tags.length > 0 && (
                <DetailPanel title="Tags">
                  <div className="flex flex-wrap gap-1.5">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </DetailPanel>
              )}
            </div>
          )}

          <CourseReviewContentPanels review={review} />

          {!canPreview && (
            <p className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Info size={14} className="mt-px shrink-0" />
              The public course page serves a course only to its own creator
              until it is published, so there is no live link for a course in
              this state.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
