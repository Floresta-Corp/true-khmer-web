import { useLoaderData, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { CourseManageHeader } from "../course-manage-header";
import { CourseManageTabs } from "../course-manage-tabs";
import { CourseKpiCards } from "../overview/course-kpi-cards";
import { CoursePerformanceChart } from "../overview/course-performance-chart";
import { StudentProgressCard } from "../overview/student-progress-card";
import { AnalyticsTab } from "../tabs/analytics-tab";
import { ContentTab } from "../tabs/content-tab";
import { ReviewStatusCard } from "../review-status-card";
import { ReviewTab } from "../tabs/review-tab";
import { StudentsTab } from "../tabs/students-tab";
import {
  ManageTabSchema,
  type ManageTab,
} from "~/features/course-manage/types";
import type { loader } from "../../route/course-manage.$id";

export default function CourseManagePage() {
  const {
    course,
    overview,
    curriculum,
    students,
    reviews,
    ratingBreakdown,
    reviewStages,
    analytics,
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const tab: ManageTab = ManageTabSchema.catch("overview").parse(
    searchParams.get("tab") ?? "overview",
  );

  const setTab = (next: ManageTab) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        if (next === "overview") params.delete("tab");
        else params.set("tab", next);
        return params;
      },
      { replace: true },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
      className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8"
    >
      <CourseManageHeader course={course} />
      <CourseManageTabs active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="flex flex-col gap-6">
          <CourseKpiCards overview={overview} />
          {/* 1.6fr : 1fr, as the design's grid specifies. */}
          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[1.6fr_1fr]">
            <CoursePerformanceChart data={overview.performance} />
            <StudentProgressCard
              total={overview.totalLearners}
              segments={overview.progress}
              courseId={course.id}
            />
          </div>

          {/* A course that has never been submitted has no pipeline to show. */}
          {(course.status !== "DRAFT" || course.rejectionNote) && (
            <ReviewStatusCard
              stages={reviewStages}
              status={course.status}
              rejectionNote={course.rejectionNote}
            />
          )}
        </div>
      )}

      {tab === "content" && (
        <ContentTab courseId={course.id} curriculum={curriculum} />
      )}

      {tab === "students" && (
        <StudentsTab students={students} courseTitle={course.title} />
      )}

      {tab === "analytics" && (
        <AnalyticsTab
          analytics={analytics}
          ratingBreakdown={ratingBreakdown}
          rating={overview.rating}
          reviewCount={overview.reviewCount}
        />
      )}

      {tab === "review" && (
        <ReviewTab
          status={course.status}
          rating={overview.rating}
          reviewCount={overview.reviewCount}
          reviews={reviews}
        />
      )}
    </motion.div>
  );
}
