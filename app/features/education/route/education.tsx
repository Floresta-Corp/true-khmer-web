import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { debounce } from "~/lib/utils";
import { CourseCategoryRow } from "../components/course-category-row";
import { CourseSection } from "../components/course-section";
import { EducationHero } from "../components/education-hero";
import { EducationPage } from "../components/education-page";
import { educationLoader } from "../services/education.loader";
import type { Route } from "./+types/education";

export const loader = educationLoader;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Education - True Khmer" },
    {
      name: "description",
      content:
        "Free online classes in business, tech, design and trades, taught by experienced Cambodian professionals.",
    },
  ];
}

export default function EducationHubPage() {
  const {
    displayName,
    categories,
    isFiltering,
    results,
    trending,
    recent,
    allCourses,
    search,
    categoryId,
    selectedCategoryName,
  } = useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [searchInput, setSearchInput] = useState(search);

  const [savedCourseIds, setSavedCourseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSavedCourseIds((current) => {
      const next = new Set(current);
      for (const course of [
        ...trending,
        ...recent,
        ...allCourses,
        ...results,
      ]) {
        if (course.isSaved) next.add(course.id);
      }
      return next;
    });
  }, [trending, recent, allCourses, results]);

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        updateParams({ search: value || null });
      }, 300),
    [updateParams],
  );

  useEffect(() => {
    if (searchInput === search) return;
    debouncedSearch(searchInput);
  }, [searchInput, search, debouncedSearch]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const toggleSave = (courseId: string) => {
    setSavedCourseIds((current) => {
      const next = new Set(current);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const resultsHeading = search
    ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${search}”`
    : (selectedCategoryName ?? "Results");

  return (
    <EducationPage>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        <EducationHero
          displayName={displayName}
          search={searchInput}
          onSearchChange={setSearchInput}
          onSearchSubmit={() => {
            debouncedSearch.cancel();
            updateParams({ search: searchInput || null });
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
      >
        <CourseCategoryRow
          categories={categories}
          activeCategoryId={categoryId}
          onSelect={(nextCategoryId) =>
            updateParams({ categoryId: nextCategoryId })
          }
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
      >
        {isFiltering ? (
          <CourseSection
            title={resultsHeading}
            courses={results}
            emptyMessage="No classes match that search yet."
            savedCourseIds={savedCourseIds}
            onToggleSave={toggleSave}
          />
        ) : (
          <>
            <CourseSection
              title="Trending Classes"
              courses={trending}
              viewAllTo="/education/all?sort=popular"
              savedCourseIds={savedCourseIds}
              onToggleSave={toggleSave}
            />
            <CourseSection
              title="Recently Added"
              courses={recent}
              viewAllTo="/education/all"
              savedCourseIds={savedCourseIds}
              onToggleSave={toggleSave}
            />
            <CourseSection
              title="All Courses"
              courses={allCourses}
              viewAllTo="/education/all"
              savedCourseIds={savedCourseIds}
              onToggleSave={toggleSave}
            />
          </>
        )}
      </motion.div>
    </EducationPage>
  );
}
