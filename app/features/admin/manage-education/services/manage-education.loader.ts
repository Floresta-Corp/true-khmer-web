import type { Route } from "project-types/admin/manage-education/route/+types/manage-education";

import {
  getAdminCourses,
  resolveCourseCreators,
  type CourseCreator,
} from "~/api/admin/education-center/education-center.server";
import { getCourseCategories } from "~/api/education/education.server";
import {
  adminCourseStatusFilterSchema,
  courseSortBySchema,
  DEFAULT_SORT_BY,
  fromStatusParam,
  type AdminCourseStatusFilter,
  type CourseSortBy,
} from "~/features/admin/manage-education/types";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { AdminListCoursesResponse } from "~/types/api-client";

const LIMIT = 12;

export type CourseCategoryOption = { id: string; name: string };

export type AdminCoursePage = AdminListCoursesResponse & {
  creators: Record<string, CourseCreator>;
};

export type ManageEducationLoaderData = {
  data: Promise<AdminCoursePage>;
  categories: CourseCategoryOption[];
};

export async function manageEducationLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);

  const url = new URL(request.url);

  const parsedSortBy = courseSortBySchema.safeParse(
    url.searchParams.get("sortBy"),
  );
  const sortBy: CourseSortBy = parsedSortBy.success
    ? parsedSortBy.data
    : DEFAULT_SORT_BY;

  const parsedStatus = adminCourseStatusFilterSchema.safeParse(
    fromStatusParam(url.searchParams.get("status")),
  );
  const status: AdminCourseStatusFilter | undefined = parsedStatus.success
    ? parsedStatus.data
    : undefined;

  const courses = getAdminCourses(request, auth.accessToken, {
    limit: LIMIT,
    cursor: url.searchParams.get("cursor") || undefined,
    search: url.searchParams.get("search")?.trim() || undefined,
    createdBy: url.searchParams.get("createdBy") || undefined,
    status,
    sortBy,
  }).then(async (page) => ({
    ...page,
    creators: await resolveCourseCreators(
      request,
      auth.accessToken,
      page.courses,
    ),
  }));

  courses.catch(() => {});

  const categories = await getCourseCategories(request);

  return withAuthData(auth, {
    data: courses,
    categories:
      categories?.data?.categories.map((category) => ({
        id: category.id,
        name: category.name,
      })) ?? [],
  } satisfies ManageEducationLoaderData);
}
