import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export interface DiscussionPost {
  id: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  tags: string[];
  timeAgo: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  likes: number;
  answers: number;
}

interface DiscussionCardProps {
  post: DiscussionPost;
  onCategoryClick?: (category: string) => void;
}

export function DiscussionCard({ post, onCategoryClick }: DiscussionCardProps) {
  return (
    <div className="bg-white border border-[#f1f5f9] rounded-2xl p-6 w-full">
      {/* Header with category and metadata */}
      <div className="flex justify-between items-start mb-5 gap-4">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onCategoryClick?.(post.category)}
            className="text-xs font-bold text-[#2f6fe4] hover:underline"
          >
            {post.category}
          </button>
          {post.badge && (
            <Badge
              variant="secondary"
              className={`text-xs font-semibold ${
                post.badgeColor === "green"
                  ? "bg-[#f0fdf0] text-[#1fc16b]"
                  : "bg-[#f0f6ff] text-[#2f6fe4]"
              }`}
            >
              {post.badge}
            </Badge>
          )}
        </div>

        {/* Time and action buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-[#9eacc0]">
            <span>{post.timeAgo}</span>
          </div>
          <button className="p-1 hover:bg-[#f8fafc] rounded transition-colors">
            <Heart size={16} className="text-[#ccc]" />
          </button>
          <button className="p-1 hover:bg-[#f8fafc] rounded transition-colors">
            <MessageSquare size={16} className="text-[#ccc]" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-[#030213] mb-2">
        {post.title}
      </h2>

      {/* Description */}
      <p className="text-xs text-[#65758b] mb-4 line-clamp-2">
        {post.description}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-[#99a1af]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#f9fafb] my-4" />

      {/* Footer with author and engagement */}
      <div className="flex justify-between items-center">
        {/* Author info */}
        <div className="flex items-center gap-2.5">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-7 h-7 rounded-full border border-[#f3f4f6]"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#344256]">
              {post.author.name}
            </p>
            <p className="text-xs text-[#9eacc0]">{post.author.role}</p>
          </div>
        </div>

        {/* Engagement metrics */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-1 px-3 h-[30px] rounded-lg border border-[#f3f4f6] bg-[#f9fafb]">
            <Button variant="ghost" size="sm" className="h-auto p-0">
              <Heart size={14} className="text-[#1fc16b]" />
            </Button>
            <span className="text-xs font-semibold text-[#1fc16b] ml-1">
              {post.likes}
            </span>
            <ChevronDown size={14} className="text-[#99a1af] ml-1" />
          </div>

          <div className="text-xs text-[#9eacc0]">{post.answers} answers</div>

          <Button variant="ghost" size="sm" className="h-auto p-0">
            <MoreHorizontal size={16} className="text-[#99a1af]" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DiscussionThreadProps {
  posts: DiscussionPost[];
  activeTab: "recent" | "topRated" | "unanswered" | "myActivity";
  onTabChange?: (
    tab: "recent" | "topRated" | "unanswered" | "myActivity",
  ) => void;
  onCategoryClick?: (category: string) => void;
}

export function DiscussionThread({
  posts,
  activeTab,
  onTabChange,
  onCategoryClick,
}: DiscussionThreadProps) {
  const tabs = [
    { id: "recent" as const, label: "Recent" },
    { id: "topRated" as const, label: "Top Rated" },
    { id: "unanswered" as const, label: "Unanswered" },
    { id: "myActivity" as const, label: "My Activity" },
  ];

  return (
    <div className="flex-1 w-full">
      {/* Tabs */}
      <div className="flex gap-5 mb-4 border-b border-[#f1f5f9] pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`text-sm font-semibold pb-2 transition-colors relative ${
              activeTab === tab.id
                ? "text-[#2f6fe4] border-b-2 border-[#2f6fe4]"
                : "text-[#9eacc0] hover:text-[#344256]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discussion posts */}
      <div className="flex flex-col gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <DiscussionCard
              key={post.id}
              post={post}
              onCategoryClick={onCategoryClick}
            />
          ))
        ) : (
          <div className="text-center py-12 text-[#9eacc0]">
            No discussions found
          </div>
        )}
      </div>

      {/* Load more button */}
      {posts.length > 0 && (
        <div className="text-center mt-8">
          <button className="text-sm font-medium text-[#9eacc0] hover:text-[#344256] transition-colors">
            Load more discussions
          </button>
        </div>
      )}
    </div>
  );
}
