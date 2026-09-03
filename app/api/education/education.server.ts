import {
  type ApiResult,
  apiRequestWithOptionalSession,
  apiRequestWithSession,
  AuthSessionExpiredError,
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

export async function withdrawCourse(request: Request, courseId: string) {
  return apiRequestWithSession<GetCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/withdraw`,
    { method: "POST" },
  );
}

export async function unpublishCourse(request: Request, courseId: string) {
  return apiRequestWithSession<GetCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/unpublish`,
    { method: "POST" },
  );
}

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
  fileSize: number;
}

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

export type LessonAssetType = "YOUTUBE" | "PDF" | "AUDIO";

export interface LessonInput {
  id?: string | null;
  title: string;
  type: LessonAssetType;
  url?: string | null;
  assetKey?: string | null;
  durationSeconds?: number | null;
  isPreview?: boolean;
}

export interface ChapterInput {
  id?: string | null;
  title: string;
  lessons: LessonInput[];
}

export interface ReplaceCurriculumBody {
  format: "MULTI" | "SINGLE";
  chapters: ChapterInput[];
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
  outcomes?: string[];
  tags?: string[];
  certificateKind?: "PARTICIPATION" | "COMPLETION" | null;
}

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

export interface CourseProgressResponse {
  ok: true;
  completedLessonIds: string[];
}

export async function getCourseProgress(request: Request, courseId: string) {
  try {
    return await apiRequestWithSession<CourseProgressResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(courseId)}/progress`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) return null;
    if (isResourceUnavailable(error, "course progress")) return null;
    throw error;
  }
}

export async function markLessonWatched(
  request: Request,
  courseId: string,
  lessonId: string,
) {
  return apiRequestWithSession<CourseProgressResponse, { lessonId: string }>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/progress`,
    { method: "PUT", body: { lessonId } },
  );
}

export interface CourseStatsResponse {
  ok: true;
  stats: {
    lessonCount: number;
    students: {
      userId: string;
      name: string;
      avatar: string | null;
      startedAt: string;
      lessonsCompleted: number;
      completedAt: string | null;
    }[];
    enrollmentTrend: { date: string; learners: number }[];
  };
}

export async function getCourseStats(request: Request, courseId: string) {
  try {
    return await apiRequestWithSession<CourseStatsResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(courseId)}/stats`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) return null;
    if (error instanceof ProtectedApiError && error.status === 403) return null;
    if (isResourceUnavailable(error, "course stats")) return null;
    throw error;
  }
}

export interface PresignLessonAssetParams {
  contentType: string;
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
      position: number;
      options: {
        id: string;
        label: string;
        isCorrect: boolean;
        position: number;
      }[];
    }[];
  };
}

export type CourseContentRead<T> =
  | { status: "loaded"; result: ApiResult<T> }
  | { status: "absent" }
  | { status: "unreadable" };

export async function readCourseCurriculum(
  request: Request,
  courseId: string,
): Promise<CourseContentRead<CourseCurriculumResponse>> {
  try {
    return {
      status: "loaded",
      result: await apiRequestWithOptionalSession<CourseCurriculumResponse>(
        request,
        `/education-center/courses/${encodeURIComponent(courseId)}/curriculum`,
        { method: "GET" },
      ),
    };
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return { status: "absent" };
    }
    if (isResourceUnavailable(error, "course curriculum")) {
      return { status: "unreadable" };
    }
    throw error;
  }
}

export async function readCourseQuiz(
  request: Request,
  courseId: string,
): Promise<CourseContentRead<CourseQuizResponse>> {
  try {
    return {
      status: "loaded",
      result: await apiRequestWithSession<CourseQuizResponse>(
        request,
        `/education-center/courses/${encodeURIComponent(courseId)}/quiz`,
        { method: "GET" },
      ),
    };
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) {
      return { status: "absent" };
    }
    if (isResourceUnavailable(error, "course quiz")) {
      return { status: "unreadable" };
    }
    throw error;
  }
}

export async function getCourseCurriculum(request: Request, courseId: string) {
  const read = await readCourseCurriculum(request, courseId);
  return read.status === "loaded" ? read.result : null;
}

export async function getCourseQuiz(request: Request, courseId: string) {
  const read = await readCourseQuiz(request, courseId);
  return read.status === "loaded" ? read.result : null;
}

export interface LearnerCourseQuizResponse {
  ok: true;
  quiz: {
    passMark: number;
    questions: {
      id: string;
      question: string;
      position: number;
      options: { id: string; label: string; position: number }[];
    }[];
  };
}

export async function getLearnerCourseQuiz(request: Request, courseId: string) {
  try {
    return await apiRequestWithOptionalSession<LearnerCourseQuizResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(
        courseId,
      )}/quiz/questions`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof ProtectedApiError && error.status === 404) return null;
    if (isResourceUnavailable(error, "learner course quiz")) return null;
    throw error;
  }
}

export interface QuizAttemptAnswer {
  questionId: string;
  optionId: string;
}

export interface GradeQuizAttemptResponse {
  ok: true;
  result: {
    correctCount: number;
    totalCount: number;
    percent: number;
    passMark: number;
    passed: boolean;
  };
}

export async function gradeCourseQuizAttempt(
  request: Request,
  courseId: string,
  answers: QuizAttemptAnswer[],
) {
  return apiRequestWithSession<
    GradeQuizAttemptResponse,
    { answers: QuizAttemptAnswer[] }
  >(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/quiz/attempt`,
    { method: "POST", body: { answers } },
  );
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
  outcomes: string[];
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
