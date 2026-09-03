import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import { BackLink } from "~/components/back-link";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn, debounce } from "~/lib/utils";
import { CourseCard } from "./course-card";
import { EducationPage } from "./education-page";
import {
  CATALOG_SORTS,
  CATALOG_SORT_LABELS,
  CATALOG_TYPES,
  CATALOG_TYPE_LABELS,
  CATALOG_TYPE_SERVABLE,
  isSortServable,
} from "~/features/education/lib/course-catalog";
import type { educationCatalogLoader } from "~/features/education/services/education-catalog.loader";

function FilterRadio({
  name,
  label,
  checked,
  onSelect,
  unavailable = false,
}: {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
  unavailable?: boolean;
}) {
  return (
    <label
      title={unavailable ? "Not available yet" : undefined}
      className={cn(
        "flex items-center gap-2.5",
        unavailable ? "cursor-not-allowed opacity-45" : "cursor-pointer",
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        disabled={unavailable}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "size-4 shrink-0 rounded-full border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1C5DD4]",
          checked
            ? "border-[#1C5DD4] bg-[#1C5DD4] shadow-[inset_0_0_0_2px_#fff]"
            : "border-[#E5E7EB] bg-transparent",
        )}
      />
      <span
        className={cn(
          "text-sm",
          checked ? "font-bold text-[#1A1A2E]" : "font-medium text-[#9A9AB0]",
        )}
      >
        {label}
      </span>
    </label>
  );
}

function FilterSection({
  title,
  divided = true,
  children,
}: {
  title: string;
  divided?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={cn(divided && "mb-4 border-b border-[#E5E7EB] pb-4")}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="mb-3 flex w-full cursor-pointer items-center justify-between gap-2 text-left"
      >
        <span className="text-sm font-bold text-[#1A1A2E]">{title}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={cn(
            "shrink-0 text-[#9A9AB0] transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open && children}
    </div>
  );
}

export function EducationCatalog() {
  const {
    categories,
    courses,
    heading,
    foundLabel,
    page,
    pageCount,
    search,
    categoryId,
    sort,
    type,
  } = useLoaderData<typeof educationCatalogLoader>();

  const [, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [searchInput, setSearchInput] = useState(search);

  const [savedCourseIds, setSavedCourseIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSavedCourseIds((current) => {
      const next = new Set(current);
      for (const course of courses) if (course.isSaved) next.add(course.id);
      return next;
    });
  }, [courses]);

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

  const setFilter = useCallback(
    (changes: Record<string, string | null>) =>
      updateParams({ ...changes, page: null }),
    [updateParams],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFilter({ search: value || null });
      }, 300),
    [setFilter],
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

  const clearAll = () => {
    debouncedSearch.cancel();
    setSearchInput("");
    setFilter({ search: null, categoryId: null, sort: null, type: null });
  };

  return (
    <EducationPage>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        <BackLink
          to="/education"
          className="mb-4.5 flex w-max items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
        >
          <ChevronLeft size={16} strokeWidth={2.2} aria-hidden />
          Back to Education
        </BackLink>

        <div className="mb-7 flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mb-1.5 text-[34px] leading-[1.15] font-extrabold text-[#1A1A2E]">
              {heading}
            </h1>
            <p className="text-sm text-[#9A9AB0]">{foundLabel}</p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              debouncedSearch.cancel();
              setFilter({ search: searchInput || null });
            }}
            className="flex w-full max-w-full items-center gap-2.5 rounded-full border border-[#E5E7EB] bg-white px-4.5 py-2.75 sm:w-80"
          >
            <Search
              size={16}
              strokeWidth={2}
              aria-hidden
              className="shrink-0 text-[#9A9AB0]"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search courses"
              aria-label="Search courses"
              className="w-full min-w-0 border-none bg-transparent text-sm text-[#333333] outline-none placeholder:text-[#9A9AB0]"
            />
          </form>
        </div>
      </motion.div>

      <div className="grid items-start gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(26,26,46,0.06),0_8px_24px_rgba(26,26,46,0.04)]"
        >
          <div className="mb-4.5 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-[#1A1A2E]">Filters</h2>
            <button
              type="button"
              onClick={clearAll}
              className="cursor-pointer text-[13px] font-semibold text-[#1C5DD4] hover:underline"
            >
              Clear all
            </button>
          </div>

          <FilterSection title="Sort by">
            <div className="flex flex-col gap-3">
              {CATALOG_SORTS.map((value) => (
                <FilterRadio
                  key={value}
                  name="sort"
                  label={CATALOG_SORT_LABELS[value]}
                  checked={sort === value}
                  unavailable={!isSortServable(value)}
                  onSelect={() =>
                    setFilter({ sort: value === "newest" ? null : value })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Categories">
            <div className="flex max-h-70 flex-col gap-3 overflow-y-auto">
              <FilterRadio
                name="categoryId"
                label="All categories"
                checked={!categoryId}
                onSelect={() => setFilter({ categoryId: null })}
              />
              {categories.map((category) => (
                <FilterRadio
                  key={category.id}
                  name="categoryId"
                  label={category.name}
                  checked={categoryId === category.id}
                  onSelect={() => setFilter({ categoryId: category.id })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Type" divided={false}>
            <div className="flex flex-col gap-3">
              {CATALOG_TYPES.map((value) => (
                <FilterRadio
                  key={value}
                  name="type"
                  label={CATALOG_TYPE_LABELS[value]}
                  checked={type === value}
                  unavailable={!CATALOG_TYPE_SERVABLE[value]}
                  onSelect={() =>
                    setFilter({ type: value === "all" ? null : value })
                  }
                />
              ))}
            </div>
          </FilterSection>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
          className="min-w-0"
        >
          {courses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white px-8 py-16 text-center">
              <p className="mb-2 text-[15px] font-semibold text-[#1A1A2E]">
                {search
                  ? `No courses found for “${search}”`
                  : "No courses match these filters."}
              </p>
              <p className="text-sm text-[#9A9AB0]">
                Try a different search term, or{" "}
                <button
                  type="button"
                  onClick={clearAll}
                  className="cursor-pointer font-semibold text-[#1C5DD4] hover:underline"
                >
                  clear filters
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isSaved={savedCourseIds.has(course.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>

              {pageCount > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-7 flex items-center justify-center gap-2"
                >
                  <PagerButton
                    label="Previous page"
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                  >
                    <ChevronLeft size={15} strokeWidth={2} aria-hidden />
                  </PagerButton>

                  {Array.from(
                    { length: pageCount },
                    (_, index) => index + 1,
                  ).map((number) => (
                    <button
                      key={number}
                      type="button"
                      aria-current={number === page ? "page" : undefined}
                      onClick={() =>
                        updateParams({
                          page: number === 1 ? null : String(number),
                        })
                      }
                      className={cn(
                        "size-8.5 cursor-pointer rounded-lg border text-sm font-semibold transition-colors",
                        number === page
                          ? "border-[#1C5DD4] bg-[#1C5DD4] text-white"
                          : "border-[#E5E7EB] bg-white text-[#333333] hover:border-[#C9D6F2]",
                      )}
                    >
                      {number}
                    </button>
                  ))}

                  <PagerButton
                    label="Next page"
                    disabled={page >= pageCount}
                    onClick={() => updateParams({ page: String(page + 1) })}
                  >
                    <ChevronRight size={15} strokeWidth={2} aria-hidden />
                  </PagerButton>
                </nav>
              )}
            </>
          )}
        </motion.div>
      </div>
    </EducationPage>
  );
}

function PagerButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8.5 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#333333] transition-colors hover:border-[#C9D6F2] disabled:cursor-default disabled:opacity-40"
    >
      {children}
    </button>
  );
}
