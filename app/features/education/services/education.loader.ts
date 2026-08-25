import type { Route as EducationRoute } from "project-types/education/route/+types/education";
import { getCourseCategories } from "~/api/education/education.server";
import {
  ALL_COURSES,
  buildLearnerSnapshot,
  CATALOG_COURSES,
  FALLBACK_CATEGORIES,
  HERO_TOPICS,
  RECENT_COURSES,
  TRENDING_COURSES,
} from "~/features/education/lib/education-fixtures";
import { getOptionalUser } from "~/lib/server/route-guards.server";
import type { CourseCategory, CourseSummary } from "~/features/education/types";

/**
 * The API and the design label some categories differently ("Technology" vs
 * "Tech"). Normalize so they merge into one entry in the row.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  technology: "tech",
  it: "tech",
  "personal development": "academics",
  education: "academics",
  language: "languages",
  trade: "trades",
};

function normalizeCategory(name: string) {
  const key = name.trim().toLowerCase();
  return CATEGORY_ALIASES[key] ?? key;
}

function matchesSearch(course: CourseSummary, search: string) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return (
    course.title.toLowerCase().includes(needle) ||
    course.description.toLowerCase().includes(needle) ||
    course.categoryName.toLowerCase().includes(needle) ||
    course.instructor.name.toLowerCase().includes(needle)
  );
}

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

  // The design's category row is fixed. Keep that order and adopt the API's id
  // wherever it publishes a matching category, so filtering can move server-side
  // later; append anything extra the API returns.
  const byName = new Map(
    apiCategories.map((category) => [
      normalizeCategory(category.name),
      category,
    ]),
  );
  const categories: CourseCategory[] = FALLBACK_CATEGORIES.map((fallback) => {
    const key = normalizeCategory(fallback.name);
    const match = byName.get(key);
    byName.delete(key);
    return match ? { ...fallback, id: match.id, slug: match.slug } : fallback;
  });
  categories.push(...byName.values());

  const displayName = user?.profile?.displayName || user?.name || "there";

  // No public catalog endpoint exists yet, so the rows come from fixtures.
  // Swap these for the API call when it lands.
  const isFiltering = Boolean(search || categoryId);
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? null;

  const results = CATALOG_COURSES.filter((course) => {
    const matchesCategory =
      !categoryId ||
      course.categoryId === categoryId ||
      course.categoryName.toLowerCase() === selectedCategoryName?.toLowerCase();
    return matchesCategory && matchesSearch(course, search);
  });

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
