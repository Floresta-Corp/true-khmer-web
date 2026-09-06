import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import SpacePagination from "~/components/space-pagination";
import { debounce } from "~/lib/utils";
import type { loader } from "../../route/my-classes";
import { MyClassTabSchema, type MyClassTab } from "~/features/my-classes/types";
import { CertificatesCta } from "../certificates-cta";
import { MyClassRow } from "../my-class-row";
import { MyClassesEmpty } from "../my-classes-empty";
import { MyClassesSkeleton } from "../my-classes-skeleton";
import { MyClassesStatCards } from "../my-classes-stats";
import { MyClassesTabs } from "../my-classes-tabs";

const SECTION_HEADING: Record<MyClassTab, string> = {
  learning: "Continue learning",
  "in-progress": "In progress",
  saved: "Saved for later",
  completed: "Completed courses",
};

export default function MyClassesPage() {
  const { courses, counts, stats, pagination, tab, search, pageSize } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const prefersReducedMotion = useReducedMotion();

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => setSearchInput(search), [search]);

  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/my-classes";

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          }
          next.delete("page");
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => updateParams({ search: value || null }), 300),
    [updateParams],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const onSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const onTabChange = (next: MyClassTab) => {
    debouncedSearch.cancel();
    updateParams({ tab: next === "learning" ? null : next });
  };

  const clearSearch = () => {
    debouncedSearch.cancel();
    setSearchInput("");
    updateParams({ search: null });
  };

  const activeTab = MyClassTabSchema.catch("learning").parse(tab);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-3xl">
            My classes
          </h1>
          <p className="text-sm text-[#8A94A6]">
            Pick up where you left off, or look back at what you&apos;ve
            finished.
          </p>
        </div>

        <div className="relative w-full min-w-0 sm:w-64">
          <Search
            size={16}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            className="h-10 rounded-xl border-slate-200 bg-white pr-4 pl-10 text-sm placeholder:text-slate-400 focus-visible:ring-blue-500/20"
            placeholder="Search my courses"
            aria-label="Search my courses"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </motion.div>

      <div className="mt-6">
        <MyClassesTabs
          active={activeTab}
          counts={counts}
          onChange={onTabChange}
        />
      </div>

      <div className="mt-6">
        <MyClassesStatCards stats={stats} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-bold text-[#344256]">
          {SECTION_HEADING[activeTab]}
        </h2>

        <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
          {isLoading ? (
            <MyClassesSkeleton />
          ) : courses.length === 0 ? (
            <MyClassesEmpty
              tab={activeTab}
              search={search}
              onClearSearch={clearSearch}
            />
          ) : (
            <div className="divide-y divide-[#eef1f5]">
              {courses.map((course) => (
                <MyClassRow key={course.courseId} course={course} />
              ))}
            </div>
          )}
        </div>

        {!isLoading && pagination.total > 0 && (
          <div className="mt-4">
            <SpacePagination
              total={pagination.total}
              totalPages={pagination.totalPages}
              pageSize={pageSize}
              itemLabel="courses"
            />
          </div>
        )}
      </section>

      {activeTab === "learning" && (
        <div className="mt-6">
          <CertificatesCta
            certificates={stats.certificates}
            onViewCertificates={() => onTabChange("completed")}
          />
        </div>
      )}
    </div>
  );
}
