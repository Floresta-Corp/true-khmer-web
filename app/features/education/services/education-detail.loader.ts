import { data } from "react-router";
import type { Route as EducationDetailRoute } from "project-types/education/route/+types/education.$id";
import {
  getCourseById,
  getCourseCategories,
  getCourseCurriculum,
  getLearnerCourseQuiz,
  listPublicCourses,
} from "~/api/education/education.server";
import { GetProfileById } from "~/api/profile/profile.server";
import { resolveImageURL } from "~/lib/utils";
import { toTelHref } from "~/features/education/lib/phone";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import { toCourseSections } from "~/features/education/lib/map-curriculum";
import type { CourseDetail, CourseSummary } from "~/features/education/types";

/** Rows the design fits under the curriculum panel. */
const RECOMMENDED_LIMIT = 4;

/**
 * Resolves a course into the full detail shape, entirely from the API.
 *
 * Anything the API has no resource for — ratings, reviews, enrolment, course
 * duration — is reported as absent rather than filled with sample content, so
 * the page never shows a learner a number nobody recorded.
 */
export async function loadCourseDetail(
  request: Request,
  courseId: string,
  /**
   * The instructor's avatar and phone need a second round trip to
   * `GET /profile/:userId`. Only the detail screen draws them, so the learning
   * screen skips that wave.
   */
  options: { withInstructorContact?: boolean } = {},
): Promise<CourseDetail | null> {
  const [courseRes, categoriesRes, curriculumRes] = await Promise.all([
    getCourseById(request, courseId),
    getCourseCategories(request),
    getCourseCurriculum(request, courseId),
  ]);

  const course = courseRes?.data?.course;
  if (!course) return null;

  // `CourseResponse.creator` carries no picture, but `GET /profile/:userId` is
  // public and does — so the instructor photo is fetched from there rather than
  // falling back to a placeholder.
  const creatorId =
    (course as { creator?: { id: string } | null }).creator?.id ??
    course.createdBy;

  let instructorAvatarUrl: string | null = null;
  let instructorPhone: string | null = null;
  if (creatorId && options.withInstructorContact) {
    try {
      const profileRes = await GetProfileById(request, creatorId);
      const avatarKey = profileRes?.data?.profile?.profile?.avatarKey ?? null;
      instructorAvatarUrl = avatarKey ? resolveImageURL(avatarKey) : null;

      // The same public profile carries the number behind the call button.
      // `country` is an ISO code ("KH"), not a dialling code, so it has to be
      // converted — concatenating it produced `tel:+KH11111111`.
      instructorPhone = toTelHref(profileRes?.data?.profile?.user?.phone);
    } catch {
      instructorAvatarUrl = null;
      instructorPhone = null;
    }
  }

  const categoryName =
    categoriesRes?.data?.categories?.find((c) => c.id === course.categoryId)
      ?.name ?? "Course";

  const sections = curriculumRes?.data?.curriculum
    ? toCourseSections(curriculumRes.data.curriculum)
    : [];

  const lessonCount = curriculumRes?.data?.curriculum.lessonCount ?? 0;
  const creator = (
    course as {
      creator?: { id: string; name: string; email?: string } | null;
    }
  ).creator;

  const skills = Array.isArray((course as { skills?: string[] }).skills)
    ? ((course as { skills?: string[] }).skills as string[])
    : [];

  const outcomes = Array.isArray((course as { outcomes?: string[] }).outcomes)
    ? ((course as { outcomes?: string[] }).outcomes as string[])
    : [];

  const difficulty = (course as { difficulty?: string | null }).difficulty;
  const level: CourseSummary["level"] =
    difficulty === "INTERMEDIATE"
      ? "Intermediate"
      : difficulty === "ADVANCE"
        ? "Advance"
        : "Beginner";

  const summary: CourseSummary = {
    id: course.id,
    title: course.title,
    description: course.description,
    categoryId: course.categoryId,
    categoryName,
    coverImageUrl: course.coverImageUrl,
    instructor: {
      id: creator?.id ?? course.createdBy,
      name: creator?.name ?? "Unknown instructor",
      avatarUrl: instructorAvatarUrl,
      coursesPublished: 0,
      phone: instructorPhone,
      email: creator?.email ?? null,
    },
    // Ratings, enrolment and reviews have no API resource, so they stay at
    // zero rather than being invented.
    rating: 0,
    ratingCount: 0,
    level,
    lessonCount,
    studentCount: 0,
    isNew: false,
    price: course.price,
    isSaved: false,
  };

  return {
    ...summary,
    // Only facts the API actually knows. Duration and rating are omitted
    // entirely rather than shown as placeholders.
    meta: [
      {
        label: "LESSONS",
        value: `${lessonCount} lesson${lessonCount === 1 ? "" : "s"}`,
      },
      { label: "LEVEL", value: level },
      {
        label: "PRICE",
        value: course.price > 0 ? `$${course.price.toFixed(2)}` : "Free",
      },
    ],
    // Raised by whichever loader asked `loadCourseHasQuiz`; this shape is
    // shared with screens that do not need the extra round trip.
    hasQuiz: false,
    // The creator picks this in the builder; it is the real source for the
    // certificate line rather than anything inferred from the quiz.
    certificateKind:
      (course as { certificateKind?: "PARTICIPATION" | "COMPLETION" | null })
        .certificateKind ?? null,
    // The design draws "Skills" chips and "What you'll learn" as two separate
    // sections with different content, and the API carries them as two fields.
    skills,
    outcomes,
    curriculum: sections,
    reviews: [],
    reviewCount: 0,
    enrolledCount: 0,
    // There is no enrolment resource, so no lesson is gated. Reporting this as
    // "not enrolled" would lock every lesson while the hero invites the learner
    // to start — the curriculum would contradict the page's own call to action.
    isEnrolled: true,
    progressPercent: 0,
    status: course.status,
  };
}

/**
 * Whether the course actually has a quiz.
 *
 * Read from the learner's copy of the quiz, which answers for any course the
 * viewer can see. The owner-only answer-key endpoint used to stand in for this
 * and made every course look quizless to everyone but its creator — so the
 * "Final quiz" row and the What's-included line never appeared for a learner.
 */
export async function loadCourseHasQuiz(
  request: Request,
  courseId: string,
): Promise<boolean> {
  const response = await getLearnerCourseQuiz(request, courseId);
  return (response?.data?.quiz?.questions?.length ?? 0) > 0;
}

export async function educationDetailLoader({
  request,
  params,
}: EducationDetailRoute.LoaderArgs) {
  // The two are independent, so they share one wave rather than two.
  const [course, hasQuiz] = await Promise.all([
    loadCourseDetail(request, params.id, { withInstructorContact: true }),
    loadCourseHasQuiz(request, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  // There is no recommendation resource, so "Recommended for you" is the rest
  // of the same category — real published courses rather than sample rows. The
  // limit is raised by one so filtering out this course still fills the rail.
  const recommendedRes = await listPublicCourses(request, {
    limit: RECOMMENDED_LIMIT + 1,
    categoryId: course.categoryId,
    sortBy: "newest",
  });

  const recommended = (recommendedRes?.data?.courses ?? [])
    .filter((item) => item.id !== course.id)
    .slice(0, RECOMMENDED_LIMIT)
    .map(toCourseSummary);

  return { course: { ...course, hasQuiz }, recommended };
}
