import {
  apiRequestWithSession,
  AuthSessionExpiredError,
  isResourceUnavailable,
} from "~/lib/server/api-client.server";

export type MyClassTab = "learning" | "in-progress" | "saved" | "completed";

export type MyClassStatus = "not-started" | "in-progress" | "completed";

export interface MyClassResponse {
  courseId: string;
  title: string;
  description: string;
  coverImageUrl: string | null;
  categoryName: string | null;
  courseStatus: "DRAFT" | "PENDING" | "PUBLISHED" | "UNPUBLISHED";
  price: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | "ALL_LEVELS" | null;
  certificateKind: "PARTICIPATION" | "COMPLETION" | null;
  instructor: { id: string; name: string } | null;
  lessonCount: number;
  lessonsCompleted: number;
  progressPercent: number;
  status: MyClassStatus;
  remainingSeconds: number | null;
  remainingSecondsEstimated: boolean;
  isEnrolled: boolean;
  isSaved: boolean;
  enrolledAt: string | null;
  savedAt: string | null;
  lastActivityAt: string | null;
  hasQuiz: boolean;
  bestQuizPercent: number | null;
  passedQuiz: boolean;
  certificateEarned: boolean;
}

export interface MyClassCountsResponse {
  learning: number;
  "in-progress": number;
  saved: number;
  completed: number;
}

export interface MyClassesStatsResponse {
  inProgress: number;
  completed: number;
  timeLearnedSeconds: number;
  certificates: number;
}

export interface ListMyClassesResponse {
  ok: true;
  courses: MyClassResponse[];
  counts: MyClassCountsResponse;
  stats: MyClassesStatsResponse;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListMyClassesParams {
  tab?: MyClassTab;
  search?: string;
  page?: number;
  limit?: number;
}

export async function listMyClasses(
  request: Request,
  params: ListMyClassesParams = {},
) {
  const query = new URLSearchParams();
  if (params.tab) query.set("tab", params.tab);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const suffix = query.toString() ? `?${query.toString()}` : "";

  try {
    return await apiRequestWithSession<ListMyClassesResponse>(
      request,
      `/education-center/my-classes${suffix}`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) return null;
    if (isResourceUnavailable(error, "my classes")) return null;
    throw error;
  }
}

export interface SaveCourseResponse {
  ok: true;
  saved: boolean;
  changed: boolean;
}

export interface CourseSaveStateResponse {
  ok: true;
  saved: boolean;
}

export async function getCourseSaveState(request: Request, courseId: string) {
  try {
    return await apiRequestWithSession<CourseSaveStateResponse>(
      request,
      `/education-center/courses/${encodeURIComponent(courseId)}/save`,
      { method: "GET" },
    );
  } catch (error) {
    if (error instanceof AuthSessionExpiredError) return null;
    if (isResourceUnavailable(error, "course save state")) return null;
    throw error;
  }
}

export async function saveCourse(request: Request, courseId: string) {
  return apiRequestWithSession<SaveCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/save`,
    { method: "POST" },
  );
}

export async function unsaveCourse(request: Request, courseId: string) {
  return apiRequestWithSession<SaveCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/save`,
    { method: "DELETE" },
  );
}

export interface LeaveCourseResponse {
  ok: true;
  left: boolean;
}

export async function leaveCourse(request: Request, courseId: string) {
  return apiRequestWithSession<LeaveCourseResponse>(
    request,
    `/education-center/courses/${encodeURIComponent(courseId)}/enroll`,
    { method: "DELETE" },
  );
}
