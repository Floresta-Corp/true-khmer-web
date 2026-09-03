import type { Route } from "project-types/admin/manage-education/route/+types/manage-education.$courseId";

import {
  getAdminCourseById,
  resolveCourseCreators,
  type CourseCreator,
} from "~/api/admin/education-center/education-center.server";
import { getCourseCategories } from "~/api/education/education.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import {
  readCourseReviewContent,
  type CourseReviewContent,
} from "~/features/admin/manage-education/types";
import type { CourseResponse } from "~/types/api-client";

export type ManageEducationDetailLoaderData = {
  course: CourseResponse;
  categoryName: string | null;
  creator: CourseCreator | null;
  review: CourseReviewContent;
};

export async function manageEducationDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const courseId = params.courseId;
  if (!courseId) {
    throw new Response("Course ID is required", { status: 400 });
  }

  try {
    const [result, categories] = await Promise.all([
      getAdminCourseById(request, auth.accessToken, courseId),
      getCourseCategories(request),
    ]);

    const categoryName =
      categories?.data?.categories.find(
        (category) => category.id === result.course.categoryId,
      )?.name ?? null;

    const creators = await resolveCourseCreators(request, auth.accessToken, [
      result.course,
    ]);

    return withAuthData(auth, {
      course: result.course,
      categoryName,
      creator: creators[result.course.createdBy] ?? null,
      review: readCourseReviewContent(result.course),
    } satisfies ManageEducationDetailLoaderData);
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      throw new Response("Course not found", { status: 404 });
    }
    throw error;
  }
}
