import {
  apiRequestWithOptionalSession,
  apiRequestWithSession,
  isResourceUnavailable,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  CreateCourseRequest,
  GetCourseResponse,
  ListCourseCategoriesResponse,
  ListMyCoursesResponse,
  PresignCourseCoverUploadResponse,
  UpdateCourseRequest,
} from "~/types/api-client";
import type { CourseStatus } from "~/features/course-listing/types";

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
    if (isResourceUnavailable(error, "education categories")) {
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

export interface ListMyCoursesParams {
  search?: string;
  status?: CourseStatus;
  limit?: number;
  cursor?: string;
  sortBy?: "newest" | "oldest";
}

/** Courses the signed-in user teaches, for the workspace Course Listing. */
export async function listMyCourses(
  request: Request,
  params: ListMyCoursesParams,
) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.sortBy) query.set("sortBy", params.sortBy);

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return apiRequestWithSession<ListMyCoursesResponse>(
    request,
    `/education-center/courses/mine${suffix}`,
    { method: "GET" },
  );
}

/** Send a draft to the review queue (DRAFT/UNPUBLISHED → PENDING). */
export async function submitCourseForReview(
  request: Request,
  courseId: string,
) {
  return apiRequestWithSession<GetCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/submit`,
    { method: "POST" },
  );
}

/** Pull a course back out of the review queue (PENDING → DRAFT). */
export async function withdrawCourse(request: Request, courseId: string) {
  return apiRequestWithSession<GetCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/withdraw`,
    { method: "POST" },
  );
}

/** Take a published course off the catalogue (PUBLISHED → UNPUBLISHED). */
export async function unpublishCourse(request: Request, courseId: string) {
  return apiRequestWithSession<GetCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/unpublish`,
    { method: "POST" },
  );
}

/**
 * Create a course. The API's course model is title/description/categoryId/
 * coverImageKey/price only — the builder's difficulty, skills, tags,
 * curriculum, quizzes and certificate have no endpoint yet, so they stay in
 * the wizard's client state.
 */
export async function createCourse(
  request: Request,
  body: CreateCourseRequest,
) {
  return apiRequestWithSession<GetCourseResponse, CreateCourseRequest>(
    request,
    `/education-center/courses`,
    { method: "POST", body },
  );
}

/** Patch an existing draft. Every field is optional. */
export async function updateCourse(
  request: Request,
  courseId: string,
  body: UpdateCourseRequest,
) {
  return apiRequestWithSession<GetCourseResponse, UpdateCourseRequest>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}`,
    { method: "PATCH", body },
  );
}

export interface PresignCourseCoverParams {
  contentType: string;
  /** Bytes. The API rejects anything over 5 MiB. */
  fileSize: number;
}

/**
 * Ask for a direct-upload URL for a cover image. The browser then PUTs the
 * file to `upload.uploadUrl` with `upload.requiredHeaders`, and the returned
 * `coverImageKey` is what gets saved on the course.
 */
export async function presignCourseCover(
  request: Request,
  params: PresignCourseCoverParams,
) {
  return apiRequestWithSession<
    PresignCourseCoverUploadResponse,
    PresignCourseCoverParams
  >(request, `/education-center/courses/cover/presign`, {
    method: "POST",
    body: params,
  });
}
