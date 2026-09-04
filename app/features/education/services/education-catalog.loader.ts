import type { Route } from "project-types/education/route/+types/education.all";
import {
  getCourseCategories,
  listPublicCourses,
} from "~/api/education/education.server";
import {
  CATALOG_PAGE_SIZE,
  CATALOG_SORT_QUERY,
  CATALOG_TYPE_SERVABLE,
  CatalogSortSchema,
  CatalogTypeSchema,
} from "~/features/education/lib/course-catalog";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

export async function educationCatalogLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") || null;
  const requestedSort = CatalogSortSchema.parse(url.searchParams.get("sort"));
  const requestedType = CatalogTypeSchema.parse(url.searchParams.get("type"));
  const requestedPage = Number(url.searchParams.get("page")) || 1;

  const sortBy = CATALOG_SORT_QUERY[requestedSort];
  const sort = sortBy ? requestedSort : "newest";
  const type = CATALOG_TYPE_SERVABLE[requestedType] ? requestedType : "all";

  const [, categoriesRes, catalogueRes] = await Promise.all([
    getOptionalUser(request),
    getCourseCategories(request),
    listPublicCourses(request, {
      page: requestedPage,
      limit: CATALOG_PAGE_SIZE,
      search: search || undefined,
      categoryId: categoryId ?? undefined,
      sortBy: sortBy ?? "newest",
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
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? null;

  const catalogue = catalogueRes?.data ?? null;
  const total = catalogue?.pagination.total ?? 0;

  return {
    categories,
    courses: (catalogue?.courses ?? []).map(toCourseSummary),
    heading: selectedCategoryName ?? "All Courses",
    foundLabel: `Found ${total} course${total === 1 ? "" : "s"}${
      selectedCategoryName ? ` in ${selectedCategoryName}` : ""
    }`,
    page: catalogue?.pagination.page ?? requestedPage,
    pageCount: Math.max(1, catalogue?.pagination.totalPages ?? 1),
    search,
    categoryId,
    selectedCategoryName,
    sort,
    type,
  };
}
