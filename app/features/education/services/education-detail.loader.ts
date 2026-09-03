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

const RECOMMENDED_LIMIT = 4;

export async function loadCourseDetail(
  request: Request,
  courseId: string,
  options: { withInstructorContact?: boolean } = {},
): Promise<CourseDetail | null> {
  const [courseRes, categoriesRes, curriculumRes] = await Promise.all([
    getCourseById(request, courseId),
    getCourseCategories(request),
    getCourseCurriculum(request, courseId),
  ]);

  const course = courseRes?.data?.course;
  if (!course) return null;

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
    hasQuiz: false,
    certificateKind:
      (course as { certificateKind?: "PARTICIPATION" | "COMPLETION" | null })
        .certificateKind ?? null,
    skills,
    outcomes,
    curriculum: sections,
    reviews: [],
    reviewCount: 0,
    enrolledCount: 0,
    isEnrolled: true,
    progressPercent: 0,
    status: course.status,
  };
}

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
  const [course, hasQuiz] = await Promise.all([
    loadCourseDetail(request, params.id, { withInstructorContact: true }),
    loadCourseHasQuiz(request, params.id),
  ]);

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

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
