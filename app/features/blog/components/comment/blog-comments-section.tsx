import { useNavigation, useSearchParams } from "react-router";
import { ListFilter } from "lucide-react";
import SortDropdown from "~/components/ui/sort-dropdown";
import { cn } from "~/lib/utils";
import type { BlogCommentResponse } from "~/types/api-client";
import type { BlogCommentSort, BlogCommentViewer } from "../../types";
import BlogCommentComposer from "./blog-comment-composer";
import BlogCommentEmpty from "./blog-comment-empty";
import BlogCommentItem from "./blog-comment-item";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" as BlogCommentSort },
  { label: "Oldest", value: "oldest" as BlogCommentSort },
];

interface BlogCommentsSectionProps {
  postId: string;
  comments: BlogCommentResponse[];
  total: number;
  sort: BlogCommentSort;
  viewer: BlogCommentViewer | null;
}

export default function BlogCommentsSection({
  postId,
  comments,
  total,
  sort,
  viewer,
}: BlogCommentsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSorting = Boolean(
    navigation.location?.search &&
    new URLSearchParams(navigation.location.search).get("sortBy") !== sort,
  );

  const handleSortChange = (value: BlogCommentSort) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("sortBy", value);
    setSearchParams(nextParams, { replace: true, preventScrollReset: true });
  };

  return (
    <section className="mt-20 border-t border-slate-200 pt-10 dark:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {total} {total === 1 ? "Comment" : "Comments"}
        </h2>

        <div className="flex items-center gap-1 text-slate-500">
          <ListFilter className="h-4 w-4" />
          <span className="text-[13px] font-medium">Sort by:</span>
          <SortDropdown
            value={sort}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            className="h-8 gap-1 px-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <BlogCommentComposer postId={postId} viewer={viewer} className="mt-6" />

      <div
        aria-busy={isSorting}
        className={cn(
          "mt-10 flex flex-col gap-10 transition-opacity",
          isSorting && "pointer-events-none opacity-50",
        )}
      >
        {comments.length === 0 ? (
          <BlogCommentEmpty />
        ) : (
          comments.map((comment, index) => (
            <BlogCommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              viewer={viewer}
              index={index}
            />
          ))
        )}
      </div>
    </section>
  );
}
