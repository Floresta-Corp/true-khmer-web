import type { Route as EducationRoute } from "project-types/education/route/+types/education";
import { getCourseCategories } from "~/api/education/education.server";
import {
  ALL_COURSES,
  buildLearnerSnapshot,
  CATALOG_COURSES,
  HERO_TOPICS,
  RECENT_COURSES,
  TRENDING_COURSES,
} from "~/features/education/lib/education-fixtures";
import {
  matchesCategory,
  matchesSearch,
  mergeCategories,
} from "~/features/education/lib/course-catalog";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory } from "~/features/education/types";

export async function educationLoader({ request }: EducationRoute.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() ?? "";
  const categoryId = url.searchParams.get("categoryId") ?? null;

  const [{ user }, categoriesRes] = await Promise.all([
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

  const displayName = user?.profile?.displayName || user?.name || "there";

  // No public catalog endpoint exists yet, so the rows come from fixtures.
  // Swap these for the API call when it lands.
  const isFiltering = Boolean(search || categoryId);
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? null;

  const results = CATALOG_COURSES.filter(
    (course) =>
      matchesCategory(course, categoryId, selectedCategoryName) &&
      matchesSearch(course, search),
  );

  return {
    learner: buildLearnerSnapshot(displayName),
    topics: HERO_TOPICS,
    categories,
    isFiltering,
    results,
    trending: TRENDING_COURSES,
    recent: RECENT_COURSES,
    allCourses: ALL_COURSES,
    search,
    categoryId,
    selectedCategoryName,
  };
}
