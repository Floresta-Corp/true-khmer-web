import { useCallback, useEffect, useMemo, useState } from "react";
import FilterPanelHeader from "~/components/filter-panel-header";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio";
import { cn, debounce } from "~/lib/utils";
import { CourseCard } from "./course-card";
import { CourseGridSkeleton } from "./course-card-skeleton";
import { EducationPage } from "./education-page";
import {
  CATALOG_SORTS,
  CATALOG_SORT_LABELS,
} from "~/features/education/lib/course-catalog";
import { useCourseSaves } from "~/features/education/hooks/use-course-saves";
import type { educationCatalogLoader } from "~/features/education/services/education-catalog.loader";

function FilterOption({
  value,
  label,
  active,
}: {
  value: string;
  label: string;
  active: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1.5 text-[13px] text-[#475569] transition-colors hover:text-[#020618]",
        active && "text-[#020618]",
      )}
    >
      <RadioGroupItem value={value} className="border-[#cbd5e1]" />
      <span>{label}</span>
    </label>
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
  } = useLoaderData<typeof educationCatalogLoader>();

  const [, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const navigation = useNavigation();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [searchInput, setSearchInput] = useState(search);

  const isReloadingResults =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname;

  const { savedCourseIds, toggleSave } = useCourseSaves(courses);

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

  const clearAll = () => {
    debouncedSearch.cancel();
    setSearchInput("");
    setFilter({ search: null, categoryId: null, sort: null });
  };

  return (
    <EducationPage surface="muted">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        <Link
          to="/education"
          className="mb-4.5 flex w-max items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
        >
          <ChevronLeft size={16} strokeWidth={2.2} aria-hidden />
          Back to Education
        </Link>

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

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
          className="rounded-[18px] border border-[#edf2f7] bg-white p-5 shadow-[0px_10px_30px_rgba(15,23,42,0.03)]"
        >
          <FilterPanelHeader onClearAll={clearAll} />

          <Accordion
            type="multiple"
            defaultValue={["sort-by", "categories"]}
            className="mt-1 gap-0"
          >
            <AccordionItem
              value="sort-by"
              className="border-b border-[#edf2f7]"
            >
              <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                Sort by
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-4">
                <RadioGroup
                  value={sort}
                  onValueChange={(value) => setFilter({ sort: value })}
                  className="gap-3"
                >
                  {CATALOG_SORTS.map((value) => (
                    <FilterOption
                      key={value}
                      value={value}
                      label={CATALOG_SORT_LABELS[value]}
                      active={sort === value}
                    />
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="categories"
              className="border-b border-[#edf2f7]"
            >
              <AccordionTrigger className="py-4 text-[13px] font-bold text-[#020618] hover:no-underline">
                Categories
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-4">
                <RadioGroup
                  value={categoryId || "all-categories"}
                  onValueChange={(value) =>
                    setFilter({
                      categoryId: value === "all-categories" ? null : value,
                    })
                  }
                  className="max-h-70 gap-3 overflow-y-auto"
                >
                  <FilterOption
                    value="all-categories"
                    label="All categories"
                    active={!categoryId}
                  />
                  {categories.map((category) => (
                    <FilterOption
                      key={category.id}
                      value={category.id}
                      label={category.name}
                      active={categoryId === category.id}
                    />
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.16 }}
          className="min-w-0"
        >
          {isReloadingResults ? (
            <CourseGridSkeleton
              count={Math.max(courses.length, 6)}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            />
          ) : courses.length === 0 ? (
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
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
