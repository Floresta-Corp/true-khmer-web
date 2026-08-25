import { useState } from "react";
import { useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { EducationPage } from "../components/education-page";
import { CourseActionBar } from "../components/course-action-bar";
import { CourseCurriculumTab } from "../components/course-curriculum-tab";
import { CourseDetailHero } from "../components/course-detail-hero";
import { CourseEnrollCard } from "../components/course-enroll-card";
import { CourseOverviewTab } from "../components/course-overview-tab";
import { CourseReviewsTab } from "../components/course-reviews-tab";
import { InstructorCard } from "../components/instructor-card";
import { educationDetailLoader } from "../services/education-detail.loader";
import type { Route } from "./+types/education.$id";

export const loader = educationDetailLoader;

export function meta({ data }: Route.MetaArgs) {
  const title = data?.course.title ?? "Course";
  return [
    { title: `${title} - True Khmer` },
    { name: "description", content: data?.course.description ?? "" },
  ];
}

const TABS = [
  { id: "details", label: "Details" },
  { id: "curriculum", label: "Curriculum" },
  { id: "reviews", label: "Reviews" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CourseDetailPage() {
  const { course } = useLoaderData<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [activeTab, setActiveTab] = useState<TabId>("details");
  // Bookmarks and enrolment have no API resource yet — see education-fixtures.
  const [isSaved, setIsSaved] = useState(course.isSaved);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: course.title, url });
        return;
      } catch {
        // The user dismissed the share sheet — fall through to copying.
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <EducationPage surface="muted">
      <CourseActionBar
        backTo="/education"
        isSaved={isSaved}
        onToggleSave={() => setIsSaved((value) => !value)}
        onShare={handleShare}
        onReport={() =>
          toast.success("Thanks — this course has been reported.")
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="min-w-0">
          <CourseDetailHero
            title={course.title}
            coverImageUrl={course.coverImageUrl}
          />

          <div
            role="tablist"
            aria-label="Course sections"
            className="mb-6 flex flex-wrap gap-2 border-b border-gray-200"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "-mb-px cursor-pointer border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
                  activeTab === tab.id
                    ? "border-[#1C5DD4] text-[#1C5DD4]"
                    : "border-transparent text-[#9A9AB0] hover:text-[#1A1A2E]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "details" && <CourseOverviewTab course={course} />}
          {activeTab === "curriculum" && (
            <CourseCurriculumTab course={{ ...course, isEnrolled }} />
          )}
          {activeTab === "reviews" && <CourseReviewsTab course={course} />}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          <CourseEnrollCard
            course={course}
            isEnrolled={isEnrolled}
            onEnroll={() => {
              setIsEnrolled(true);
              toast.success(`You're enrolled in ${course.title}.`);
            }}
          />
          <InstructorCard instructor={course.instructor} />
        </aside>
      </motion.div>
    </EducationPage>
  );
}
