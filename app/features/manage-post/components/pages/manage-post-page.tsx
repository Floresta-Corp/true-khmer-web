import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import PostingPagination from "../manage-post-pagination";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import ManagePostCard from "../card/manage-post-card";
import ManagePostCardSkeleton from "../manage-post-skeleton";
import ManagePostFilters from "../card/manage-post-filter";
import type { loader } from "../../route/manage-post";
import type { ManagePost } from "../../types";
import CreateOpportunityDialog from "../dialog/manage-post-button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

type TabType = "all" | "projects" | "volunteer";

type FilterType =
  | "all"
  | "live"
  | "draft"
  | "in_progress"
  | "canceled"
  | "completed"
  | "filled";

const VALID_TABS = ["all", "volunteer", "projects"] as const;
const VALID_STATUS_VALUES = [
  "all",
  "live",
  "draft",
  "in_progress",
  "canceled",
  "completed",
  "filled",
] as const;

function isValidTab(value: string | null): value is TabType {
  return value !== null && VALID_TABS.includes(value as TabType);
}

function isValidStatus(value: string | null): value is FilterType {
  return (
    value !== null &&
    VALID_STATUS_VALUES.includes(value as (typeof VALID_STATUS_VALUES)[number])
  );
}

export default function ManagePostingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const { postings, pagination } = useLoaderData<typeof loader>();
  const [activeType, setActiveType] = useState<TabType>(() => {
    const rawType = searchParams.get("type");
    return isValidTab(rawType) ? rawType : "all";
  });
  const [filter, setFilter] = useState<FilterType>(() => {
    const rawFilter = searchParams.get("filter");
    return isValidStatus(rawFilter) ? rawFilter : "all";
  });
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const isLoading =
    navigation.state === "loading" &&
    navigation.location?.pathname === "/manage-post";

  const isLastPage = pagination ? !pagination.hasNextPage : true;

  useEffect(() => {
    const rawType = searchParams.get("type");
    const nextType = isValidTab(rawType) ? rawType : "all";
    const rawFilter = searchParams.get("filter");
    const nextFilter = isValidStatus(rawFilter) ? rawFilter : "all";
    const nextSearch = searchParams.get("search") ?? "";

    setActiveType(nextType);
    setFilter(nextFilter);
    setSearchInput(nextSearch);
  }, [searchParams]);

  const applySearchParams = (nextParams: URLSearchParams) => {
    setSearchParams(nextParams, { replace: true });
  };

  const handleTypeChange = (type: TabType) => {
    setActiveType(type);
    const nextParams = new URLSearchParams(searchParams);
    if (!type || type === "all") {
      nextParams.delete("type");
    } else {
      nextParams.set("type", type);
    }
    nextParams.delete("page");
    applySearchParams(nextParams);
  };

  const handleFilterChange = (value: FilterType) => {
    setFilter(value);
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      nextParams.delete("filter");
    } else {
      nextParams.set("filter", value);
    }
    nextParams.delete("page");
    applySearchParams(nextParams);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }
    nextParams.delete("page");
    applySearchParams(nextParams);
  };

  return (
    <WorkSpacePageLayout
      title="Manage Posting"
      subtitle="Manage and monitor your active community opportunities postings."
      action={<CreateOpportunityDialog />}
    >
      <div className="-mt-5 mb-5 max-w-none">
        <ManagePostFilters
          activeType={activeType}
          filter={filter}
          searchInput={searchInput}
          onTypeChange={handleTypeChange}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ManagePostCardSkeleton key={i} />
          ))
        ) : (
          <>
            {postings.map((posting: ManagePost, index: number) => (
              <ManagePostCard
                key={posting.id}
                index={index}
                posting={posting}
              />
            ))}
            {isLastPage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <CreateOpportunityDialog
                  trigger={
                    <button
                      type="button"
                      className="group flex h-full min-h-55 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-none p-5 outline-2 outline-gray-200 transition-all outline-dashed hover:bg-gray-50 hover:outline-blue-400"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors group-hover:border-blue-400 group-hover:text-blue-500">
                        <Plus size={20} strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-[15px] font-bold text-gray-500 transition-colors group-hover:text-blue-600">
                          New Posting
                        </p>
                        <p className="text-[12px] text-gray-400">
                          Start a new community opportunity
                        </p>
                      </div>
                    </button>
                  }
                />
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="mt-10 pb-10">
        <PostingPagination
          total={pagination?.total ?? postings.length}
          totalPages={pagination?.totalPages}
          pageSize={pagination?.limit ?? 6}
        />
      </div>
    </WorkSpacePageLayout>
  );
}
