import type { Route } from "project-types/education/route/+types/education.all";
import { getCourseCategories } from "~/api/education/education.server";
import {
  CATALOG_PAGE_SIZE,
  CatalogSortSchema,
  CatalogTypeSchema,
  matchesCategory,
  matchesTitle,
  matchesType,
  mergeCategories,
  pageOf,
  sortCourses,
} from "~/features/education/lib/course-catalog";
import { CATALOG_COURSES } from "~/features/education/lib/education-fixtures";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

/**
 * The full catalogue behind every "View all" link on the Education hub.
 *
 * Public, like the hub: browsing does not need a session. There is no catalogue
 * endpoint yet, so the courses come from the same fixtures the hub rows use.
 */
export async function educationCatalogLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") || null;
  const sort = CatalogSortSchema.parse(url.searchParams.get("sort"));
  const type = CatalogTypeSchema.parse(url.searchParams.get("type"));
  const requestedPage = Number(url.searchParams.get("page")) || 1;

  const [, categoriesRes] = await Promise.all([
    getOptionalUser(request),
    getCourseCategories(request),
  ]);

  const apiCategories: CourseCategory[] = (
    categoriesRes?.data?.categories ?? []
  ).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    iconKey: category.iconKey,
  }));

  const categories = mergeCategories(apiCategories);
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? null;

  const matching = sortCourses(
    CATALOG_COURSES.filter(
      (course) =>
        matchesCategory(course, categoryId, selectedCategoryName) &&
        matchesType(course, type) &&
        matchesTitle(course, search),
    ),
    sort,
  );

  const { page, pageCount } = pageOf(matching.length, requestedPage);
  const courses = matching.slice(
    (page - 1) * CATALOG_PAGE_SIZE,
    page * CATALOG_PAGE_SIZE,
  );

  return {
    categories,
    courses,
    // The heading becomes the category name once one is chosen, and the count
    // names it too — both straight from the design.
    heading: selectedCategoryName ?? "All Courses",
    foundLabel: `Found ${matching.length} course${matching.length === 1 ? "" : "s"}${
      selectedCategoryName ? ` in ${selectedCategoryName}` : ""
    }`,
    page,
    pageCount,
    search,
    categoryId,
    selectedCategoryName,
    sort,
    type,
  };
}
