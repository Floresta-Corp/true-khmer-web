import { z } from "zod";
import type { PublicCourseSort } from "~/api/education/education.server";
import type { CourseCategory, CourseSummary } from "~/features/education/types";

export function matchesTitle(course: CourseSummary, search: string) {
  if (!search) return true;
  return course.title.toLowerCase().includes(search.toLowerCase());
}

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
 * Each catalogue sort and the API sort that serves it.
 *
 * "Most popular" and "Highest rated" order by enrolment and review counts the
 * database holds, so they have to be sorted server-side: sorting the page the
 * API already returned would only rank those eight courses against each other.
 */
/**
 * What the catalogue calls itself when a hub row sent the viewer there.
 *
 * "View all" on a row has to land somewhere that reads as that row — before
 * this, every sort arrived at a page headed "All Courses", so Recently Added
 * and All Courses were indistinguishable destinations.
 */
export const CATALOG_SORT_HEADINGS: Record<CatalogSort, string> = {
  newest: "Recently Added",
  popular: "Trending Classes",
  rating: "Highest Rated",
  az: "All Courses",
};

export const CATALOG_SORT_QUERY: Record<CatalogSort, PublicCourseSort> = {
  newest: "newest",
  popular: "popular",
  rating: "rating",
  az: "az",
};

export const CATALOG_PAGE_SIZE = 8;

export function pageOf(total: number, requested: number) {
  const pageCount = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  return { page: Math.min(Math.max(1, requested), pageCount), pageCount };
}
