import { useNavigation, useSearchParams } from "react-router";
import { motion } from "motion/react";
import CommentReplyBox from "~/components/comment-reply-box";
import SortDropdown from "~/components/ui/sort-dropdown";
import { cn } from "~/lib/utils";
import type { BlogCommentResponse } from "~/types/api-client";
import {
  BLOG_COMMENT_ACTIONS,
  type BlogCommentSort,
  type BlogCommentViewer,
} from "../../types";
import BlogCommentCard from "./blog-comment-card";
import BlogCommentEmpty from "./blog-comment-empty";
import BlogCommentSignInPrompt from "./blog-comment-sign-in-prompt";

const BODY_MAX_LENGTH = 10000;

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
    <motion.section
      className="mt-20 flex flex-col gap-6 border-t border-slate-200 pt-10 dark:border-white/10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="flex items-center justify-between">
        <h3 className="flex gap-3 text-lg font-bold text-gray-900 md:text-xl dark:text-white">
          Comments <p className="text-slate-400">({total})</p>
        </h3>
        <div className="flex items-center gap-3">
          <p className="text-sm leading-5 font-semibold text-[#595c5e]">
            Sort by:
          </p>
          <SortDropdown
            value={sort}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            className="inline-flex items-center bg-transparent text-base leading-6 font-semibold text-[#0050d4]"
          />
        </div>
      </div>

      {viewer ? (
        <CommentReplyBox
          fields={{ actionType: BLOG_COMMENT_ACTIONS.create, postId }}
          placeholder="Share your thoughts..."
          submitLabel="Comment"
          maxLength={BODY_MAX_LENGTH}
        />
      ) : (
        <BlogCommentSignInPrompt />
      )}

      <div
        aria-busy={isSorting}
        className={cn(
          "flex flex-col gap-6 transition-opacity",
          isSorting && "pointer-events-none opacity-50",
        )}
      >
        {comments.length === 0 ? (
          <BlogCommentEmpty />
        ) : (
          comments.map((comment, index) => (
            <BlogCommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              viewer={viewer}
              index={index}
            />
          ))
        )}
      </div>
    </motion.section>
  );
}
