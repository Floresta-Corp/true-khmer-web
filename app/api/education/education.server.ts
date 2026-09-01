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
 * Create a course. This covers the Basic step's core fields; the builder's
 * difficulty, skills, tags, curriculum, quiz and certificate are saved
 * afterwards through the curriculum endpoints below.
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

/**
 * Update an existing draft. Every field is optional.
 *
 * PUT, not PATCH: the API registers only GET/PUT/DELETE on this path, so a
 * PATCH is unrouted and comes back 404.
 */
export async function updateCourse(
  request: Request,
  courseId: string,
  body: UpdateCourseRequest,
) {
  return apiRequestWithSession<GetCourseResponse, UpdateCourseRequest>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}`,
    { method: "PUT", body },
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

/* ------------------------ Curriculum, quiz and meta ----------------------- */

export type LessonAssetType = "YOUTUBE" | "PDF" | "AUDIO";

export interface LessonInput {
  title: string;
  type: LessonAssetType;
  url?: string | null;
  assetKey?: string | null;
  durationSeconds?: number | null;
  isPreview?: boolean;
}

export interface ReplaceCurriculumBody {
  format: "MULTI" | "SINGLE";
  chapters: { title: string; lessons: LessonInput[] }[];
}

export interface ReplaceQuizBody {
  passMark: number;
  questions: {
    question: string;
    options: { label: string; isCorrect: boolean }[];
  }[];
}

export interface UpdateCourseMetaBody {
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | "ALL_LEVELS" | null;
  skills?: string[];
  tags?: string[];
  certificateKind?: "PARTICIPATION" | "COMPLETION" | null;
}

/** Replaces the whole curriculum — the builder holds all of it in state. */
export async function replaceCourseCurriculum(
  request: Request,
  courseId: string,
  body: ReplaceCurriculumBody,
) {
  return apiRequestWithSession<{ ok: true }, ReplaceCurriculumBody>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/curriculum`,
    { method: "PUT", body },
  );
}

export async function replaceCourseQuiz(
  request: Request,
  courseId: string,
  body: ReplaceQuizBody,
) {
  return apiRequestWithSession<{ ok: true }, ReplaceQuizBody>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/quiz`,
    { method: "PUT", body },
  );
}

/** Difficulty, skills, tags and certificate kind. */
export async function updateCourseMeta(
  request: Request,
  courseId: string,
  body: UpdateCourseMetaBody,
) {
  return apiRequestWithSession<GetCourseResponse, UpdateCourseMetaBody>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/meta`,
    { method: "PATCH", body },
  );
}

export interface PresignLessonAssetParams {
  contentType: string;
  /** Bytes. The API rejects anything over 100 MiB. */
  fileSize: number;
}

export interface PresignLessonAssetResponse {
  ok: true;
  upload: {
    uploadUrl: string;
    method: "PUT";
    requiredHeaders: Record<string, string>;
    assetKey: string;
    publicUrl: string | null;
    expiresInSeconds: number;
  };
}

/** Direct-upload URL for a lesson's PDF or audio file. */
export async function presignLessonAsset(
  request: Request,
  params: PresignLessonAssetParams,
) {
  return apiRequestWithSession<
    PresignLessonAssetResponse,
    PresignLessonAssetParams
  >(request, `/education-center/courses/lesson/presign`, {
    method: "POST",
    body: params,
  });
}

export interface CourseCurriculumResponse {
  ok: true;
  curriculum: {
    format: "MULTI" | "SINGLE";
    chapters: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        type: LessonAssetType;
        url: string | null;
        assetKey: string | null;
        assetUrl: string | null;
        durationSeconds: number | null;
        isPreview: boolean;
      }[];
    }[];
    lessonCount: number;
  };
}

export interface CourseQuizResponse {
  ok: true;
  quiz: {
    passMark: number;
    questions: {
      id: string;
      question: string;
      options: { id: string; label: string; isCorrect: boolean }[];
    }[];
  };
}

/**
 * The saved curriculum. Returns null when the API has no curriculum resource,
 * so the builder can still open against an older deployment.
 */
export async function getCourseCurriculum(request: Request, courseId: string) {
  try {
    return await apiRequestWithOptionalSession<CourseCurriculumResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(courseId)}/curriculum`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) return null;
    if (isResourceUnavailable(error, "course curriculum")) return null;
    throw error;
  }
}

/** The saved quiz, answer key included. Owner-only on the API. */
export async function getCourseQuiz(request: Request, courseId: string) {
  try {
    return await apiRequestWithSession<CourseQuizResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(courseId)}/quiz`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) return null;
    if (isResourceUnavailable(error, "course quiz")) return null;
    throw error;
  }
}

export interface PublicCourseListItem {
  id: string;
  title: string;
  creator: { id: string; name: string; email: string } | null;
  description: string;
  categoryId: string;
  categoryName: string | null;
  coverImageUrl: string | null;
  price: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | "ALL_LEVELS" | null;
  skills: string[];
  tags: string[];
  lessonCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export interface ListPublicCoursesResponse {
  ok: true;
  courses: PublicCourseListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListPublicCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  pricing?: "free" | "paid";
  sortBy?: "newest" | "oldest" | "az" | "price";
}

/**
 * The public catalogue of published courses. Returns null on an API that has
 * no catalogue endpoint, so the hub can fall back to its fixtures.
 */
export async function listPublicCourses(
  request: Request,
  params: ListPublicCoursesParams,
) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.pricing) query.set("pricing", params.pricing);
  if (params.sortBy) query.set("sortBy", params.sortBy);

  const suffix = query.toString() ? `?${query.toString()}` : "";

  try {
    return await apiRequestWithOptionalSession<ListPublicCoursesResponse>(
      request,
      `/education-center/courses${suffix}`,
      { method: "GET" },
    );
  } catch (error) {
    if (isResourceUnavailable(error, "course catalogue")) return null;
    throw error;
  }
}
