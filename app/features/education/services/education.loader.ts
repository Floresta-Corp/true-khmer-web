import type { Route as EducationRoute } from "project-types/education/route/+types/education";
import {
  getCourseCategories,
  listPublicCourses,
} from "~/api/education/education.server";
import { toCourseSummary } from "~/features/education/lib/map-catalog";
import {
  loadSavedCourseIds,
  withSaveState,
} from "~/features/education/services/course-saves.loader";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

/** How many cards a hub row shows before "View all" takes over. */
const SECTION_LIMIT = 4;

export async function educationLoader({ request }: EducationRoute.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") ?? null;
  const isFiltering = Boolean(search || categoryId);

  const [{ user }, categoriesRes, catalogueRes, trendingRes, savedCourseIds] =
    await Promise.all([
      getOptionalUser(request),
      getCourseCategories(request),
      listPublicCourses(request, {
        page: 1,
        limit: 24,
        search: search || undefined,
        categoryId: categoryId ?? undefined,
        sortBy: "newest",
      }),
      /* Trending is its own popularity-ordered query, not a slice of the newest
         page — the most enrolled course is rarely the most recent one. Skipped
         while a filter is on, since the row is not rendered then. */
      isFiltering
        ? Promise.resolve(null)
        : listPublicCourses(request, {
            page: 1,
            limit: SECTION_LIMIT,
            sortBy: "popular",
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

  const displayName = user?.profile?.displayName || user?.name || "there";

  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? null;

  const published = withSaveState(
    (catalogueRes?.data?.courses ?? []).map(toCourseSummary),
    savedCourseIds,
  );

  const trending = withSaveState(
    (trendingRes?.data?.courses ?? []).map(toCourseSummary),
    savedCourseIds,
  );

  return {
    displayName,
    categories,
    isFiltering,
    results: published,
    trending,
    recent: published.slice(0, SECTION_LIMIT),
    allCourses: published.slice(0, SECTION_LIMIT),
    search,
    categoryId,
    selectedCategoryName,
  };
}
