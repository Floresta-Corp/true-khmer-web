import type { Route as EducationRoute } from "project-types/education/route/+types/education";
import {
  getCourseCategories,
  listPublicCourses,
} from "~/api/education/education.server";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

export async function educationLoader({ request }: EducationRoute.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") ?? null;

  const [{ user }, categoriesRes, catalogueRes] = await Promise.all([
    getOptionalUser(request),
    getCourseCategories(request),
    listPublicCourses(request, {
      page: 1,
      limit: 24,
      search: search || undefined,
      categoryId: categoryId ?? undefined,
      sortBy: "newest",
    }),
  ]);

  const apiCategories: CourseCategory[] = (
    categoriesRes?.data?.categories ?? []
  ).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    iconKey: category.iconKey,
  }));

  const categories = apiCategories;

  const displayName = user?.profile?.displayName || user?.name || "there";

  const isFiltering = Boolean(search || categoryId);
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? null;

  const published = (catalogueRes?.data?.courses ?? []).map(toCourseSummary);

  return {
    displayName,
    categories,
    isFiltering,
    results: published,
    trending: published.slice(0, 8),
    recent: published.slice(0, 8),
    allCourses: published,
    search,
    categoryId,
    selectedCategoryName,
  };
}
