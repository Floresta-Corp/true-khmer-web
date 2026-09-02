import type { Route } from "project-types/education/route/+types/education.all";
import {
  getCourseCategories,
  listPublicCourses,
} from "~/api/education/education.server";
import {
  CATALOG_PAGE_SIZE,
  CatalogSortSchema,
  CatalogTypeSchema,
} from "~/features/education/lib/course-catalog";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

/**
 * The full catalogue behind every "View all" link on the Education hub.
 *
 * Public, like the hub: browsing does not need a session. Every row is a real
 * published course — an empty catalogue renders the empty state rather than
 * sample content.
 */
export async function educationCatalogLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") || null;
  const sort = CatalogSortSchema.parse(url.searchParams.get("sort"));
  const type = CatalogTypeSchema.parse(url.searchParams.get("type"));
  const requestedPage = Number(url.searchParams.get("page")) || 1;

  const [, categoriesRes, catalogueRes] = await Promise.all([
    getOptionalUser(request),
    getCourseCategories(request),
    listPublicCourses(request, {
      page: requestedPage,
      limit: CATALOG_PAGE_SIZE,
      search: search || undefined,
      categoryId: categoryId ?? undefined,
      // "newest" and "az" map straight across; the catalogue's popularity and
      // rating sorts have no data behind them, so they fall back to newest.
      sortBy: sort === "az" ? "az" : "newest",
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
    // The heading becomes the category name once one is chosen, and the count
    // names it too — both straight from the design.
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
