import {
  apiRequestWithOptionalSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  GetCourseResponse,
  ListCourseCategoriesResponse,
} from "~/types/api-client";

/**
 * Education Center endpoints that exist on the API today.
 *
 * The learner-facing catalog listing, curriculum, enrolment, quiz and
 * certificate resources are not exposed yet; those parts of the UI read from
 * `~/features/education/lib/education-fixtures` until the backend ships them.
 */

export async function getCourseCategories(request: Request) {
  try {
    return await apiRequestWithOptionalSession<ListCourseCategoriesResponse>(
      request,
      `/education-center/categories`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getCourseById(request: Request, courseId: string) {
  try {
    return await apiRequestWithOptionalSession<GetCourseResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(courseId)}`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
