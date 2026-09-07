import { getAdminUserManagementDetail } from "~/api/admin/user-management/user-management.server";
import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  AdminListCoursesResponse,
  DeleteCourseResponse,
  GetCourseResponse,
  RejectCourseRequest,
} from "~/types/api-client";
import type { AdminCourseStatusFilter } from "~/features/admin/manage-education/types";

export interface AdminCourseListParams {
  limit?: number;
  cursor?: string;
  search?: string;
  status?: AdminCourseStatusFilter;
  sortBy?: "newest" | "oldest";
  createdBy?: string;
}

export async function getAdminCourses(
  request: Request,
  accessToken: string,
  params: AdminCourseListParams,
) {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.createdBy) query.set("createdBy", params.createdBy);

  const suffix = query.toString() ? `?${query.toString()}` : "";

  return apiRequestWithAccessToken<AdminListCoursesResponse>(
    request,
    accessToken,
    `/admin/education-center/courses${suffix}`,
    { method: "GET" },
  );
}

export async function getAdminCourseById(
  request: Request,
  accessToken: string,
  courseId: string,
) {
  return apiRequestWithAccessToken<GetCourseResponse>(
    request,
    accessToken,
    `/admin/education-center/courses/${encodeURIComponent(courseId)}`,
    { method: "GET" },
  );
}

export async function approveCourse(
  request: Request,
  accessToken: string,
  courseId: string,
) {
  return apiRequestWithAccessToken<GetCourseResponse>(
    request,
    accessToken,
    `/admin/education-center/courses/${encodeURIComponent(courseId)}/approve`,
    { method: "POST" },
  );
}

export async function rejectCourse(
  request: Request,
  accessToken: string,
  courseId: string,
  note?: string,
) {
  return apiRequestWithAccessToken<GetCourseResponse, RejectCourseRequest>(
    request,
    accessToken,
    `/admin/education-center/courses/${encodeURIComponent(courseId)}/reject`,
    { method: "POST", body: note ? { note } : {} },
  );
}

export async function setCoursePublication(
  request: Request,
  accessToken: string,
  courseId: string,
  action: "PUBLISH" | "UNPUBLISH",
) {
  return apiRequestWithAccessToken<GetCourseResponse>(
    request,
    accessToken,
    `/admin/education-center/courses/${encodeURIComponent(
      courseId,
    )}/publication/${action}`,
    { method: "PUT" },
  );
}

export async function deleteAdminCourse(
  request: Request,
  accessToken: string,
  courseId: string,
) {
  return apiRequestWithAccessToken<DeleteCourseResponse>(
    request,
    accessToken,
    `/admin/education-center/courses/${encodeURIComponent(courseId)}`,
    { method: "DELETE" },
  );
}

export type CourseCreator = { name: string; email: string | null };

type CourseWithMaybeCreator = {
  createdBy: string;
  creator?: { id: string; name: string; email: string } | null;
};

export async function resolveCourseCreators(
  request: Request,
  accessToken: string,
  courses: CourseWithMaybeCreator[],
): Promise<Record<string, CourseCreator>> {
  const resolved: Record<string, CourseCreator> = {};

  for (const course of courses) {
    if (course.creator) {
      resolved[course.createdBy] = {
        name: course.creator.name,
        email: course.creator.email,
      };
    }
  }

  const missing = [
    ...new Set(
      courses
        .map((course) => course.createdBy)
        .filter((id) => !(id in resolved)),
    ),
  ];

  if (missing.length === 0) return resolved;

  const entries = await Promise.all(
    missing.map(async (id) => {
      try {
        const { data } = await getAdminUserManagementDetail(
          request,
          id,
          accessToken,
        );
        const user = data.user;
        return [
          id,
          { name: user.displayName || user.name, email: user.email },
        ] as const;
      } catch {
        return null;
      }
    }),
  );

  for (const entry of entries) {
    if (entry) resolved[entry[0]] = entry[1];
  }

  return resolved;
}
