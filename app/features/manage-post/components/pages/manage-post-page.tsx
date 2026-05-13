import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import PostingPagination from "../manage-post-pagination";
import {
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "react-router";
import ManagePostCard from "../card/manage-post-card";
import ManagePostCardSkeleton from "../manage-post-skeleton";
import ManagePostFilters from "../card/manage-post-filter";
import type { loader } from "../../routes/manage-post";
import CreateOpportunityDialog from "../dialog/manage-post-button";
import PostingNewCard from "../card/manage-new-post";

export default function ManagePostingPage() {
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "ALL";
  const status = searchParams.get("status") ?? "ALL";
  const search = searchParams.get("search") ?? "";

  const { postings, pagination } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const filtered = postings.filter((p) => {
    if (activeTab !== "ALL" && p.sourceType !== activeTab) return false;
    if (status !== "ALL" && p.status !== status) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <WorkSpacePageLayout
      title="Manage Posting"
      subtitle="Manage and monitor your active community opportunities postings."
      action={<CreateOpportunityDialog />}
    >
      <div className="-mt-8">
        <ManagePostFilters />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ManagePostCardSkeleton key={i} />
          ))
        ) : (
          <>
            {filtered.map((posting: any, index: number) => (
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
          showing={filtered.length}
        />
      </div>
    </WorkSpacePageLayout>
  );
}
