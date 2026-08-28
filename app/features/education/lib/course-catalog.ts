import { z } from "zod";
import { FALLBACK_CATEGORIES } from "~/features/education/lib/education-fixtures";
import type { CourseCategory, CourseSummary } from "~/features/education/types";

/**
 * Catalogue filtering and sorting, shared by the Education hub and the
 * "View all" page so the two cannot drift apart.
 */

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

/**
 * The design's category row is fixed. Keep that order and adopt the API's id
 * wherever it publishes a matching category, so filtering can move server-side
 * later; append anything extra the API returns.
 */
export function mergeCategories(
  apiCategories: CourseCategory[],
): CourseCategory[] {
  const byName = new Map(
    apiCategories.map((category) => [
      normalizeCategory(category.name),
      category,
    ]),
  );

  const categories = FALLBACK_CATEGORIES.map((fallback) => {
    const key = normalizeCategory(fallback.name);
    const match = byName.get(key);
    byName.delete(key);
    return match ? { ...fallback, id: match.id, slug: match.slug } : fallback;
  });

  categories.push(...byName.values());
  return categories;
}

/**
 * The catalogue matches on title alone — the design's All Courses screen
 * filters with `c.title.toLowerCase().includes(query)`. The hub's own search is
 * broader, so it keeps its own matcher below.
 */
export function matchesTitle(course: CourseSummary, search: string) {
  if (!search) return true;
  return course.title.toLowerCase().includes(search.toLowerCase());
}

/** The hub searches across title, blurb, category and instructor. */
export function matchesSearch(course: CourseSummary, search: string) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return (
    course.title.toLowerCase().includes(needle) ||
    course.description.toLowerCase().includes(needle) ||
    course.categoryName.toLowerCase().includes(needle) ||
    course.instructor.name.toLowerCase().includes(needle)
  );
}

/** Categories are matched by id, falling back to name while ids are fixtures. */
export function matchesCategory(
  course: CourseSummary,
  categoryId: string | null,
  categoryName: string | null,
) {
  if (!categoryId) return true;
  return (
    course.categoryId === categoryId ||
    course.categoryName.toLowerCase() === categoryName?.toLowerCase()
  );
}

/* -------------------------------- Sorting -------------------------------- */

export const CATALOG_SORTS = ["newest", "popular", "rating", "az"] as const;

export type CatalogSort = (typeof CATALOG_SORTS)[number];

export const CatalogSortSchema = z.enum(CATALOG_SORTS).catch("newest");

export const CATALOG_SORT_LABELS: Record<CatalogSort, string> = {
  newest: "Newest",
  popular: "Most popular",
  rating: "Highest rated",
  az: "A\u2013Z",
};

/** "Newest" is the catalogue's own order — the design applies no comparator. */
export function sortCourses(
  courses: CourseSummary[],
  sort: CatalogSort,
): CourseSummary[] {
  const ordered = [...courses];

  switch (sort) {
    case "popular":
      return ordered.sort((a, b) => b.studentCount - a.studentCount);
    case "rating":
      return ordered.sort((a, b) => b.rating - a.rating);
    case "az":
      return ordered.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return ordered;
  }
}

/* --------------------------------- Type ---------------------------------- */

export const CATALOG_TYPES = ["all", "courses", "ks"] as const;

export type CatalogType = (typeof CATALOG_TYPES)[number];

export const CatalogTypeSchema = z.enum(CATALOG_TYPES).catch("all");

export const CATALOG_TYPE_LABELS: Record<CatalogType, string> = {
  all: "All",
  courses: "Courses",
  ks: "Knowledge Sharing",
};

export function matchesType(course: CourseSummary, type: CatalogType) {
  if (type === "all") return true;
  const isKnowledgeSharing = course.type === "ks";
  return type === "ks" ? isKnowledgeSharing : !isKnowledgeSharing;
}

/* ------------------------------ Pagination ------------------------------- */

/** The design pages the grid at eight cards. */
export const CATALOG_PAGE_SIZE = 8;

export function pageOf(total: number, requested: number) {
  const pageCount = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  return { page: Math.min(Math.max(1, requested), pageCount), pageCount };
}
