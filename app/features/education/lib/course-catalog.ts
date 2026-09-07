import { z } from "zod";
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

export const CATALOG_TYPES = ["all", "courses", "ks"] as const;

export type CatalogType = (typeof CATALOG_TYPES)[number];

export const CatalogTypeSchema = z.enum(CATALOG_TYPES).catch("all");

export const CATALOG_TYPE_LABELS: Record<CatalogType, string> = {
  all: "All",
  courses: "Courses",
  ks: "Knowledge Sharing",
};

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

export const CATALOG_PAGE_SIZE = 8;

export function pageOf(total: number, requested: number) {
  const pageCount = Math.max(1, Math.ceil(total / CATALOG_PAGE_SIZE));
  return { page: Math.min(Math.max(1, requested), pageCount), pageCount };
}
