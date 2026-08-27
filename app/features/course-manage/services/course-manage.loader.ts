import { data } from "react-router";
import type { Route } from "project-types/course-manage/route/+types/course-manage.$id";
import { getCourseById } from "~/api/education/education.server";
import { MY_COURSES_FIXTURES } from "~/features/course-listing/lib/my-courses-fixtures";
import {
  buildAnalytics,
  buildManageOverview,
  buildRatingBreakdown,
  buildReviewStages,
  buildStudents,
} from "~/features/course-manage/lib/course-manage-fixtures";
import { enrichCourseDetail } from "~/features/education/lib/education-fixtures";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";

/**
 * Only the creator manages a course, so this sits behind a session. The course
 * itself is real when the API knows it; the Course Listing placeholders resolve
 * here too, so the screen can be reviewed against the design.
 */
export async function courseManageLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireUser(request);

  const result = await getCourseById(request, params.id);
  const course =
    result?.data?.course ??
    MY_COURSES_FIXTURES.find((entry) => entry.id === params.id) ??
    null;

  if (!course) {
    throw data({ message: "Course not found" }, { status: 404 });
  }

  const overview = buildManageOverview(course);

  // Curriculum and reviews come from the same builder the learner-facing detail
  // uses, so the teacher and learner views cannot drift apart.
  const detail = enrichCourseDetail({
    id: course.id,
    title: course.title,
    description: course.description,
    categoryId: course.categoryId,
    categoryName: "Business",
    coverImageUrl: course.coverImageUrl,
    instructor: {
      id: course.createdBy,
      name: "Kosal Em",
      avatarUrl: "/images/education/instructors/kosal-em.jpg",
      coursesPublished: 3,
    },
    rating: overview.rating,
    ratingCount: overview.reviewCount,
    level: "Beginner",
    lessonCount: overview.lessonCount,
    studentCount: overview.enrollments,
    isNew: false,
    price: course.price,
    isSaved: false,
  });

  return withAuthData(auth, {
    course,
    overview,
    curriculum: detail.curriculum,
    reviews: detail.reviews,
    students: buildStudents(course, overview),
    ratingBreakdown: buildRatingBreakdown(
      course,
      overview.rating,
      overview.reviewCount,
    ),
    reviewStages: buildReviewStages(course),
    analytics: buildAnalytics(course, overview),
  });
}
