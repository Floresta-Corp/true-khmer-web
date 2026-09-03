import { z } from "zod";
import type { CourseCategory, CourseSummary } from "~/features/education/types";

/**
 * Catalogue filtering and sorting, shared by the Education hub and the
 * "View all" page so the two cannot drift apart.
 */

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

/** Categories match on id, falling back to name for a differently-labelled one. */
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

/**
 * The `sortBy` each option asks the API for, or `null` when the API cannot
 * order by it.
 *
 * The catalogue is paged server-side, so the order has to come from the API.
 * Popularity and rating have no data behind them — enrolment and reviews have
 * no resource — and quietly sending `newest` for them answered a different
 * question than the learner asked. They are offered as disabled instead.
 */
export const CATALOG_SORT_QUERY: Record<
  CatalogSort,
  "newest" | "oldest" | "az" | "price" | null
> = {
  newest: "newest",
  popular: null,
  rating: null,
  az: "az",
};

export function isSortServable(sort: CatalogSort) {
  return CATALOG_SORT_QUERY[sort] !== null;
}

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

/**
 * Which type filters the catalogue can actually answer.
 *
 * Every published row the API serves is a course; there is no knowledge-sharing
 * resource and no parameter to filter on one. "Knowledge Sharing" is therefore
 * offered as disabled rather than returning the full course list under a label
 * that promises something else.
 */
export const CATALOG_TYPE_SERVABLE: Record<CatalogType, boolean> = {
  all: true,
  courses: true,
  ks: false,
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
