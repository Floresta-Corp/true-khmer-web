import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  Link,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
          <Button
            onClick={() => onCategoryClick?.(post.category)}
            variant="ghost"
            className="h-auto px-0 py-0 text-xs font-bold text-[#2f6fe4] hover:underline"
          >
            {post.category}
          </Button>
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
          <Button
            variant="ghost"
            size="icon"
            className="p-1 hover:bg-[#f8fafc] rounded transition-colors"
          >
            <Heart size={16} className="text-[#ccc]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1 hover:bg-[#f8fafc] rounded transition-colors"
          >
            <MessageSquare size={16} className="text-[#ccc]" />
          </Button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-[#030213] mb-2">
        <Link to={`/forum/${post.id}`} className="hover:text-[#2f6fe4]">
          {post.title}
        </Link>
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
          <div className="flex h-7.5 items-center gap-1 rounded-lg border border-[#f3f4f6] bg-[#f9fafb] px-3">
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
  const tabs: Array<{ id: DiscussionThreadProps["activeTab"]; label: string }> =
    [
      { id: "recent" as const, label: "Recent" },
      { id: "topRated" as const, label: "Top Rated" },
      { id: "unanswered" as const, label: "Unanswered" },
      { id: "myActivity" as const, label: "My Activity" },
    ];

  return (
    <div className="flex-1 w-full">
      {/* Tabs */}
      <Tabs
        className="mb-3.5"
        value={activeTab}
        onValueChange={(value) =>
          onTabChange?.(value as DiscussionThreadProps["activeTab"])
        }
      >
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="after:-bottom-px h-auto text-sm font-semibold text-[#9eacc0] transition-colors hover:text-[#344256] data-[state=active]:text-[#2f6fe4] data-[state=active]:after:bg-[#2f6fe4]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
          <Button
            variant="ghost"
            className="h-auto px-0 py-0 text-sm font-medium text-[#9eacc0] hover:text-[#344256] transition-colors"
          >
            Load more discussions
          </Button>
        </div>
      )}
    </div>
  );
}
