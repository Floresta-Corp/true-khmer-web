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

/**
 * Education Center endpoints that exist on the API today.
 *
 * Enrolment, progress, ratings, reviews and certificates have no resource
 * here yet. The screens that would show them omit those blocks — nothing in
 * this feature substitutes placeholder data for a missing endpoint.
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
  /**
   * Sent back for a lesson that already exists, so the API updates it in place
   * instead of recreating it. Recorded learner progress is keyed on the lesson
   * id, so dropping this from a save would reset every learner's completions.
   */
  id?: string | null;
  title: string;
  type: LessonAssetType;
  url?: string | null;
  assetKey?: string | null;
  durationSeconds?: number | null;
  isPreview?: boolean;
}

export interface ChapterInput {
  /** As with a lesson: present for a section the course already has. */
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

/** Difficulty, skills, outcomes, tags and certificate kind. */
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

/**
 * The signed-in learner's completed lessons. Returns null when nobody is
 * signed in or the deployment has no progress resource, so the learning screen
 * falls back to an empty set rather than failing to load.
 *
 * Only those two cases are absorbed: a bare catch here also swallowed the
 * login redirect a failed token refresh throws, and turned a broken API into
 * "nothing watched yet" — which reads as lost progress.
 */
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

/** Records a lesson as watched. Idempotent on the API. */
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

/**
 * The creator's own learner figures, derived from recorded lesson progress.
 * Owner-only; returns null for anyone else or on a deployment without the
 * endpoint, so the manage screen renders empty rather than failing.
 *
 * A 403 counts as "not yours to see". Anything else still throws, so a failing
 * stats service is not reported to the creator as zero learners.
 */
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

/**
 * Why a curriculum or quiz read came back with nothing.
 *
 * The two empty cases are not interchangeable. `absent` is a course that has
 * none saved yet; `unreadable` is a read that failed. A save replaces the
 * curriculum wholesale, so the builder may send one for the first case and
 * must not for the second — collapsing both to `null` left a draft with no
 * curriculum unable to ever gain one.
 */
export type CourseContentRead<T> =
  | { status: "loaded"; result: ApiResult<T> }
  | { status: "absent" }
  | { status: "unreadable" };

/** The saved curriculum, with the reason behind an empty answer. */
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

/** The saved quiz, answer key included, with the reason behind an empty answer. */
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

/**
 * The saved curriculum. Returns null when the API has no curriculum resource,
 * so the builder can still open against an older deployment.
 */
export async function getCourseCurriculum(request: Request, courseId: string) {
  const read = await readCourseCurriculum(request, courseId);
  return read.status === "loaded" ? read.result : null;
}

/** The saved quiz, answer key included. Owner-only on the API. */
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

/**
 * The quiz as a learner sits it: the questions, with no `isCorrect` on any
 * option.
 *
 * `getCourseQuiz` above carries the answer key and so answers for the creator
 * alone — it is no use to a learner. This one has the same visibility as the
 * curriculum: any published course, plus the creator's own drafts. Returns
 * null when the course has no quiz, or on a deployment without the resource.
 */
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
    /** The questions that could be marked — what the score is out of. */
    totalCount: number;
    percent: number;
    passMark: number;
    passed: boolean;
  };
}

/**
 * Marks one attempt at the final quiz.
 *
 * Grading is the API's job because the answer key never leaves it. Attempts
 * are not stored — there is no attempt resource — so this returns the result
 * and nothing else remembers it.
 */
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

/**
 * The public catalogue of published courses. Returns null on an API that has
 * no catalogue endpoint, leaving the hub with an empty catalogue.
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
