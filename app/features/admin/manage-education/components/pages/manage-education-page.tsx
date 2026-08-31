import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  Await,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";

import ContentLoadError from "~/features/admin/components/content-load-error";
import { ALL_STATUSES } from "~/features/admin/manage-education/types";
import { debounce } from "~/lib/utils";
import type { manageEducationLoader } from "../../services/manage-education.loader";
import ManageEducationCourses, {
  BASE_PATH,
  filterKeyOf,
} from "../manage-education-courses";
import { ManageEducationFilters } from "../manage-education-filters";
import { ManageEducationRowsSkeleton } from "../manage-education-page-skeleton";

export default function ManageEducationPage() {
  const { data, categories } = useLoaderData<typeof manageEducationLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const activeStatus = searchParams.get("status") || ALL_STATUSES;
  const activeSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(activeSearch);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === "") next.delete(key);
            else next.set(key, value);
          }
          next.delete("cursor");
          return next;
        },
        { replace: true, preventScrollReset: true },
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

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleStatusChange = useCallback(
    (status: string) =>
      updateParams({ status: status === ALL_STATUSES ? null : status }),
    [updateParams],
  );

  const searchKey = filterKeyOf(searchParams);

  const isRevalidating =
    navigation.state === "loading" &&
    navigation.location?.pathname === BASE_PATH;

  // Only a filter change swaps the list out; a plain revalidation keeps it.
  const isFiltering =
    isRevalidating &&
    filterKeyOf(new URLSearchParams(navigation.location?.search)) !== searchKey;

  const hasFilters = activeSearch !== "" || activeStatus !== ALL_STATUSES;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-6xl space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              Education Management
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Review courses submitted for approval and manage what is live in
              the Education Center.
            </p>
          </div>

          <ManageEducationFilters
            status={activeStatus}
            searchInput={searchInput}
            onStatusChange={handleStatusChange}
            onSearchChange={(value) => {
              setSearchInput(value);
              debouncedSearch(value);
            }}
          />

          {isFiltering ? (
            <ManageEducationRowsSkeleton />
          ) : (
            <Suspense
              key={searchKey}
              fallback={<ManageEducationRowsSkeleton />}
            >
              <Await
                resolve={data}
                errorElement={<ContentLoadError noun="courses" />}
              >
                {(firstPage) => (
                  <ManageEducationCourses
                    firstPage={firstPage}
                    categoryNames={categoryNames}
                    hasFilters={hasFilters}
                  />
                )}
              </Await>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
