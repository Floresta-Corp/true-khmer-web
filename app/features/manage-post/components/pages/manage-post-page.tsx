import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import PostingPagination from "../manage-post-pagination";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import ManagePostCard from "../card/manage-post-card";
import ManagePostCardSkeleton from "../manage-post-skeleton";
import ManagePostFilters from "../card/manage-post-filter";
import type { loader } from "../../routes/manage-post";
import CreateOpportunityDialog from "../dialog/manage-post-button";
import { Plus } from "lucide-react";

export default function ManagePostingPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const { postings, pagination } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const result = postings.filter((v) =>
    v.title.toLowerCase().includes(search?.toLowerCase() ?? ""),
  );

  return (
    <WorkSpacePageLayout
      title="Manage Posting"
      subtitle="Manage and monitor your active community opportunities postings."
      action={<CreateOpportunityDialog />}
    >
      <div className="mb-10 -mt-5 max-w-none">
        <ManagePostFilters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ManagePostCardSkeleton key={i} />
          ))
        ) : (
          <>
            {result.map((posting: any, index: number) => (
              <ManagePostCard
                key={posting.id}
                index={index}
                posting={posting}
              />
            ))}
            <CreateOpportunityDialog
              trigger={
                <button
                  type="button"
                  className="w-full h-full outline-dashed outline-2 outline-gray-200 border-none rounded-2xl p-5 flex flex-col items-center justify-center gap-2 min-h-55 hover:bg-gray-50 hover:outline-blue-400 transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-colors shadow-sm">
                    <Plus size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-gray-500 group-hover:text-blue-600 transition-colors">
                      New Posting
                    </p>
                    <p className="text-[12px] text-gray-400">
                      Start a new community opportunity
                    </p>
                  </div>
                </button>
              }
            />
          </>
        )}
      </div>

      <div className="mt-10">
        <PostingPagination
          total={pagination?.total ?? postings.length}
          showing={postings.length}
        />
      </div>
    </WorkSpacePageLayout>
  );
}
