import type { Route } from "project-types/education/route/+types/education.all";
import {
  getCourseCategories,
  listPublicCourses,
} from "~/api/education/education.server";
import {
  CATALOG_PAGE_SIZE,
  CATALOG_SORT_HEADINGS,
  CATALOG_SORT_QUERY,
  CatalogSortSchema,
} from "~/features/education/lib/course-catalog";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import {
  loadSavedCourseIds,
  withSaveState,
} from "~/features/education/services/course-saves.loader";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

export async function educationCatalogLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") || null;
  /* Kept raw as well as parsed: an absent sort is the plain catalogue, while an
     explicit one means a hub row sent the viewer here and names the page. */
  const rawSort = url.searchParams.get("sort");
  const requestedSort = CatalogSortSchema.parse(rawSort);
  const requestedPage = Number(url.searchParams.get("page")) || 1;

  const sort = requestedSort;

  const [, categoriesRes, catalogueRes, savedCourseIds] = await Promise.all([
    getOptionalUser(request),
    getCourseCategories(request),
    listPublicCourses(request, {
      page: requestedPage,
      limit: CATALOG_PAGE_SIZE,
      search: search || undefined,
      categoryId: categoryId ?? undefined,
      sortBy: CATALOG_SORT_QUERY[sort],
    }),
    loadSavedCourseIds(request),
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
  const sortHeading = rawSort ? CATALOG_SORT_HEADINGS[sort] : "All Courses";

  return {
    categories,
    courses: withSaveState(
      (catalogue?.courses ?? []).map(toCourseSummary),
      savedCourseIds,
    ),
    heading: selectedCategoryName ?? sortHeading,
    foundLabel: `Found ${total} course${total === 1 ? "" : "s"}${
      selectedCategoryName ? ` in ${selectedCategoryName}` : ""
    }`,
    page: catalogue?.pagination.page ?? requestedPage,
    pageCount: Math.max(1, catalogue?.pagination.totalPages ?? 1),
    search,
    categoryId,
    selectedCategoryName,
    sort,
  };
}
