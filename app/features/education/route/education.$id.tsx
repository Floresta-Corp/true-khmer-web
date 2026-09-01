import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { BookOpen, Check, Mail, Phone, Signal, Tag } from "lucide-react";
import { toast } from "sonner";
import { EducationPage } from "../components/education-page";
import { CourseActionBar } from "../components/course-action-bar";
import { CourseCurriculumTab } from "../components/course-curriculum-tab";
import { CourseDetailHero } from "../components/course-detail-hero";
import { StarRating } from "../components/star-rating";
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

const META_ICON = { LESSONS: BookOpen, LEVEL: Signal, PRICE: Tag } as const;

/** 19px/700 section heading, used for every block in the left column. */
const HEADING = "mb-3.5 text-[19px] font-bold text-[#1A1A2E]";

export default function CourseDetailPage() {
  const { course } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  // Bookmarks and enrolment have no API resource yet.
  const [isSaved, setIsSaved] = useState(course.isSaved);

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

  const firstLesson = course.curriculum[0]?.lessons[0] ?? null;
  const metaLine = course.meta
    .filter((item) => item.label !== "PRICE")
    .map((item) => item.value)
    .join(" · ");

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
      >
        <CourseDetailHero
          title={course.title}
          coverImageUrl={course.coverImageUrl}
          metaLine={metaLine}
          rating={course.rating}
          reviewCount={course.reviewCount}
          enrolledLabel={
            course.enrolledCount > 0
              ? `${course.enrolledCount.toLocaleString()} enrolled`
              : null
          }
          actionLabel={firstLesson ? "Start learning" : "Course unavailable"}
          onAction={() => {
            if (!firstLesson) return;
            navigate(`/education/${course.id}/learn?lesson=${firstLesson.id}`);
          }}
        />

        {/* The design puts the content and the curriculum side by side rather
            than behind tabs. */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            {course.meta.length > 0 && (
              <>
                <div className="mb-3.5 text-[11px] font-bold tracking-[0.08em] text-[#9A9AB0]">
                  WHAT&apos;S INCLUDED
                </div>
                <div className="mb-8 flex flex-col gap-3.5">
                  {course.meta.map((item) => {
                    const Icon =
                      META_ICON[item.label as keyof typeof META_ICON] ??
                      BookOpen;
                    return (
                      <div key={item.label} className="flex items-center gap-3">
                        <Icon
                          className="size-5 shrink-0 text-[#9A9AB0]"
                          aria-hidden
                        />
                        <span className="text-sm text-[#333333]">
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="mb-8">
              <h3 className={HEADING}>Course description</h3>
              <p className="text-sm leading-[1.65] text-pretty text-[#333333]">
                {course.description}
              </p>
            </div>

            {course.outcomes.length > 0 && (
              <div className="mb-8">
                <h3 className={HEADING}>What you&apos;ll learn</h3>
                <div className="flex flex-col gap-2.5">
                  {course.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="flex items-start gap-2.5 text-sm text-[#333333]"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-[#1FC16B]"
                        aria-hidden
                      />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8 flex flex-wrap items-center gap-3.5">
              <span className="size-11.5 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                <img
                  src={
                    course.instructor.avatarUrl ??
                    "/images/avatar_placeholder.webp"
                  }
                  alt=""
                  className="size-full object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-base font-bold text-[#1A1A2E]">
                  {course.instructor.name}
                </div>
                <div className="text-xs text-[#9A9AB0]">Instructor</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-[#EFF4FE]">
                  <Phone className="size-4.25 text-[#174FB4]" aria-hidden />
                </span>
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-[#EFF4FE]">
                  <Mail className="size-4.25 text-[#174FB4]" aria-hidden />
                </span>
              </div>
            </div>

            {/* Reviews have no API resource, so the block only appears once a
                course actually has some. */}
            {course.reviews.length > 0 && (
              <div>
                <h3 className="mb-5 text-[19px] font-bold text-[#1A1A2E]">
                  Review
                </h3>
                <div className="mb-5 flex items-center gap-4">
                  <span className="text-[38px] leading-none font-extrabold text-[#1A1A2E]">
                    {course.rating.toFixed(1)}
                  </span>
                  <div>
                    <StarRating value={course.rating} />
                    <div className="mt-1 text-xs text-[#9A9AB0]">
                      {course.reviewCount.toLocaleString()} reviews
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4.5">
                  {course.reviews.map((review) => (
                    <div key={review.id}>
                      <div className="mb-1.5 flex items-center gap-2.5">
                        <span className="size-8 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                          <img
                            src={
                              review.avatarUrl ??
                              "/images/avatar_placeholder.webp"
                            }
                            alt=""
                            className="size-full object-cover"
                          />
                        </span>
                        <span className="text-sm font-bold text-[#1A1A2E]">
                          {review.name}
                        </span>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="text-sm leading-[1.6] text-[#9A9AB0]">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <CourseCurriculumTab course={course} />
          </div>
        </div>
      </motion.div>
    </EducationPage>
  );
}
