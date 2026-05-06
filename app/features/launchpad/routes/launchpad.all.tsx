import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useFetcher,
} from "react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import { GetLaunchpadProjectsPaginated } from "~/services/launchpad/server/launchpad.opportunities.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import type { Category } from "~/services/launchpad/types/category";
import LaunchpadProjectCard from "../components/card/launchpad-project-card";
import { CategoryCard } from "~/components/category-card";
import BackToButton from "~/components/back-to-button";
import { motion, useReducedMotion } from "motion/react";

const PAGE_SIZE = 9;

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId") || undefined;
  const cityId = url.searchParams.get("cityId") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const cursor = url.searchParams.get("cursor") || undefined;

  const [{ launchpads, nextCursor }, categoriesRes] = await Promise.all([
    GetLaunchpadProjectsPaginated(request, {
      limit: PAGE_SIZE,
      categoryId,
      cityId,
      search,
      cursor,
      sortBy: "newest",
    }),
    getPublicLaunchpadCategories(request),
  ]);

  return {
    projects: launchpads,
    nextCursor,
    categories: categoriesRes?.data?.categories ?? [],
    categoryId: categoryId ?? null,
  };
}

export function meta() {
  return [{ title: "All Projects | True Khmer Launchpad" }];
}

export default function LaunchpadAllPage() {
  const initialData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof loader>();
  const prefersReducedMotion = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const activeCategoryId = searchParams.get("categoryId");

  // Accumulated projects — reset when category changes
  const [allProjects, setAllProjects] = useState<LaunchpadOpportunity[]>(
    initialData.projects,
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor,
  );

  // When the loader re-runs (category change navigates), reset accumulated list
  useEffect(() => {
    setAllProjects(initialData.projects);
    setNextCursor(initialData.nextCursor);
  }, [initialData]);

  // Append fetched page to the list
  useEffect(() => {
    if (fetcher.data) {
      setAllProjects((prev) => [...prev, ...fetcher.data!.projects]);
      setNextCursor(fetcher.data.nextCursor);
    }
  }, [fetcher.data]);

  // Infinite scroll via Intersection Observer
  useEffect(() => {
    if (!nextCursor) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && fetcher.state !== "loading") {
          const params = new URLSearchParams();
          params.set("cursor", nextCursor);
          params.set("sortBy", "newest");
          if (activeCategoryId) params.set("categoryId", activeCategoryId);
          const cityId = searchParams.get("cityId");
          const search = searchParams.get("search");
          if (cityId) params.set("cityId", cityId);
          if (search) params.set("search", search);
          fetcher.load(`/launchpad/all?${params.toString()}`);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, activeCategoryId, searchParams, fetcher]);

  const onOpenOpportunity = useCallback(
    (item: LaunchpadOpportunity) => {
      navigate(`/launchpad/detail/${item.id}`);
    },
    [navigate],
  );

  const handleCategoryClick = (categoryId: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (categoryId) {
        next.set("categoryId", categoryId);
      } else {
        next.delete("categoryId");
      }
      next.delete("cursor");
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
          }}
          className="flex items-center justify-between"
        >
          <BackToButton to="/launchpad" />
        </motion.div>
        <h1 className="text-3xl font-bold">All Projects</h1>

        {/* Category grid */}
        {initialData.categories.length > 0 && (
          <div className="w-full flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-1 pb-1 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:px-0 lg:grid-cols-4 xl:grid-cols-6">
            {initialData.categories.map((category: Category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <div
                  key={category.id}
                  className="shrink-0 snap-start md:min-w-0 md:shrink md:w-full cursor-pointer"
                  onClick={() =>
                    handleCategoryClick(isActive ? null : category.id)
                  }
                >
                  <CategoryCard
                    category={{
                      ...category,
                      displayOrder: category.roleCount,
                      updatedBy: category.updatedBy ?? undefined,
                    }}
                    active={isActive}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 mb-8" />

        {/* Project grid */}
        {allProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {allProjects.map((item) => (
              <LaunchpadProjectCard
                key={item.id}
                item={item}
                onOpenOpportunity={onOpenOpportunity}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No projects found.</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeCategoryId
                ? "Try selecting a different category."
                : "No projects available right now."}
            </p>
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-px" />

        {/* Loading indicator */}
        {fetcher.state === "loading" && (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        )}
      </div>
    </main>
  );
}
