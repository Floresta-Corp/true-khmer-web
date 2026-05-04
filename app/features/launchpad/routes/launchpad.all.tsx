import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useFetcher,
} from "react-router";
import { useState, useCallback, useEffect } from "react";
import { GetLaunchpadProjectsPaginated } from "~/services/launchpad/server/launchpad.opportunities.server";
import { getPublicLaunchpadCategories } from "~/services/launchpad/server/launchpad.categories.server";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";
import type { Category } from "~/services/launchpad/types/category";
import LaunchpadProjectCard from "../components/card/launchpad-project-card";
import { Button } from "~/components/ui/button";
import {
  ChevronLeft,
  BookOpen,
  Shapes,
  Globe,
  Heart,
  Users,
  Zap,
} from "lucide-react";

const PAGE_SIZE = 9;

function CategoryIcon({ iconKey }: { iconKey: string }) {
  const props = { className: "w-5 h-5" };
  switch (iconKey) {
    case "BookOpen":
      return <BookOpen {...props} />;
    case "Globe":
      return <Globe {...props} />;
    case "Heart":
      return <Heart {...props} />;
    case "Users":
      return <Users {...props} />;
    case "Zap":
      return <Zap {...props} />;
    default:
      return <Shapes {...props} />;
  }
}

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

  const onOpenOpportunity = useCallback(
    (item: LaunchpadOpportunity) => {
      navigate(`/launchpad/detail/${item.id}`);
    },
    [navigate],
  );

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      setSearchParams({ categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleLoadMore = () => {
    if (!nextCursor) return;
    const params = new URLSearchParams();
    params.set("cursor", nextCursor);
    params.set("sortBy", "newest");
    if (activeCategoryId) params.set("categoryId", activeCategoryId);
    const cityId = searchParams.get("cityId");
    const search = searchParams.get("search");
    if (cityId) params.set("cityId", cityId);
    if (search) params.set("search", search);
    fetcher.load(`/launchpad/all?${params.toString()}`);
  };

  const isLoadingMore = fetcher.state === "loading";

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/launchpad")}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 w-fit cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              All Projects
            </h1>
          </div>
        </div>

        {/* Category filter pills */}
        {initialData.categories.length > 0 && (
          <div
            className="flex justify-between gap-3 mb-8 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {initialData.categories.map((category: Category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() =>
                    handleCategoryClick(isActive ? null : category.id)
                  }
                  className={`flex shrink-0 items-center gap-3 px-3.75 py-3 rounded-[28px] border transition-all cursor-pointer ${
                    isActive
                      ? "border-blue-300 bg-blue-50"
                      : "border-[#f3f4f6] bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex size-[38.5px] shrink-0 items-center justify-center rounded-full ${
                      isActive
                        ? "bg-blue-200 text-blue-700"
                        : "bg-[#eff6ff] text-[#2563eb]"
                    }`}
                  >
                    <CategoryIcon iconKey={category.iconKey} />
                  </div>
                  <div className="flex flex-col items-start gap-[3.5px]">
                    <span
                      className={`text-sm font-bold leading-3.5 ${
                        isActive ? "text-blue-700" : "text-[#030213]"
                      }`}
                    >
                      {category.name}
                    </span>
                    <span className="text-xs font-medium leading-4.5 text-[#99a1af]">
                      {category.roleCount} roles
                    </span>
                  </div>
                </button>
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
              Try selecting a different category.
            </p>
          </div>
        )}

        {/* Load more */}
        {nextCursor && (
          <div className="mt-8">
            <Button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="ghost"
              className="h-auto w-full px-0 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
