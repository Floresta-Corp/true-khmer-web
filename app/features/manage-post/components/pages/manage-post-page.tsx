import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import PostingPagination from "../manage-post-pagination";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import ManagePostCard from "../card/manage-post-card";
import ManagePostCardSkeleton from "../manage-post-skeleton";
import ManagePostFilters from "../card/manage-post-filter";
import type { loader } from "../../routes/manage-post";
import CreateOpportunityDialog from "../dialog/manage-post-button";
import PostingNewCard from "../card/manage-new-post";

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
      <div className="mb-10 -mt-5 max-w-auto">
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
            <PostingNewCard />
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
