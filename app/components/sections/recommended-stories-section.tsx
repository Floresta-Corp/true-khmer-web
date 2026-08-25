import { Eye, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  views: number;
  likes: number;
  shares: number;
}

interface RecommendedStoriesSectionProps {
  stories?: Story[];
  onStoryClick?: (story: Story) => void;
  onLike?: (storyId: string) => void;
  onShare?: (storyId: string) => void;
}

const imgEye =
  "http://localhost:3845/assets/849a705fad52ebc7f14c5ed6f732a296675c36d1.svg";
const imgHeart =
  "http://localhost:3845/assets/2c7e8c8bda49659cfde00dd0157a9f18e344b03a.svg";
const imgShare2 =
  "http://localhost:3845/assets/b7a4e6e7fb47ba8ff6e61a3a1502bbd87a53a9a2.svg";

const defaultStories: Story[] = [
  {
    id: "1",
    title: "Rising entrepreneurs of Phnom Penh",
    description:
      "A deep dive into the burgeoning tech ecosystem in the heart of Cambodia's capital.",
    image:
      "http://localhost:3845/assets/24cfd2cfc3fd61e889fb79905d8198ad8c17d6c9.png",
    duration: "6:15",
    views: 2500,
    likes: 890,
    shares: 0,
  },
  {
    id: "2",
    title: "Rising entrepreneurs of Phnom Penh",
    description:
      "A deep dive into the burgeoning tech ecosystem in the heart of Cambodia's capital.",
    image:
      "http://localhost:3845/assets/9e8bbc780a3ce92e4b6fe59abd6f9f2dcdbfd018.png",
    duration: "6:15",
    views: 2500,
    likes: 890,
    shares: 0,
  },
  {
    id: "3",
    title: "Rising entrepreneurs of Phnom Penh",
    description:
      "A deep dive into the burgeoning tech ecosystem in the heart of Cambodia's capital.",
    image:
      "http://localhost:3845/assets/8c7507055d9c5fa993ecec8165c0f96531b3d76f.png",
    duration: "6:15",
    views: 2500,
    likes: 890,
    shares: 0,
  },
  {
    id: "4",
    title: "Rising entrepreneurs of Phnom Penh",
    description:
      "A deep dive into the burgeoning tech ecosystem in the heart of Cambodia's capital.",
    image:
      "http://localhost:3845/assets/f664aaa3bb3ebb519482fcaae6fc6f8e8e1c5867.png",
    duration: "6:15",
    views: 2500,
    likes: 890,
    shares: 0,
  },
];

function StoryCard({ story, onCardClick, onLike, onShare, delay }: any) {
  return (
    <div
      className="animate-slide-up flex cursor-pointer flex-col gap-[21px]"
      onClick={() => onCardClick?.(story)}
      style={{ animationDelay: `${delay}s` }}
      data-node-id="story-card"
    >
      {/* Image Container */}
      <div className="relative h-[289px] flex-shrink-0 overflow-hidden rounded-[14px] bg-gray-100 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
        <img
          alt={story.title}
          className="h-full w-full object-cover"
          src={story.image}
        />
        {/* Duration Badge */}
        {story.duration && (
          <div
            className="animate-slide-up absolute right-[14px] bottom-[20px] rounded-lg bg-black/60 px-2 py-1"
            style={{ animationDelay: `${delay + 0.15}s` }}
          >
            <p className="text-[11px] leading-tight font-bold text-white">
              {story.duration}
            </p>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div
          className="animate-slide-up"
          style={{ animationDelay: `${delay + 0.1}s` }}
        >
          <h3 className="line-clamp-1 text-[17px] leading-tight font-bold tracking-tight text-gray-900 transition-colors duration-300 hover:text-blue-600">
            {story.title}
          </h3>
        </div>

        {/* Description */}
        <p
          className="animate-slide-up line-clamp-2 text-[14px] leading-[22.75px] font-medium tracking-tight text-gray-600"
          style={{ animationDelay: `${delay + 0.15}s` }}
        >
          {story.description}
        </p>

        {/* Engagement Metrics */}
        <div
          className="animate-slide-up flex items-center gap-[21px] text-gray-500"
          style={{ animationDelay: `${delay + 0.2}s` }}
        >
          {/* Views */}
          <div className="flex items-center gap-[5px] transition-colors duration-300 hover:text-gray-900">
            <img alt="views" className="h-[14px] w-[14px]" src={imgEye} />
            <span className="text-[11px] leading-tight font-bold">
              {story.views > 1000
                ? `${(story.views / 1000).toFixed(1)}k`
                : story.views}
            </span>
          </div>

          {/* Likes */}
          <div
            className="flex cursor-pointer items-center gap-[5px] transition-all duration-300 hover:scale-110 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(story.id);
            }}
          >
            <img alt="likes" className="h-[14px] w-[14px]" src={imgHeart} />
            <span className="text-[11px] leading-tight font-bold">
              {story.likes}
            </span>
          </div>

          {/* Shares */}
          <div
            className="flex cursor-pointer items-center gap-[5px] transition-all duration-300 hover:scale-110 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(story.id);
            }}
          >
            <img alt="shares" className="h-[14px] w-[14px]" src={imgShare2} />
            <span className="text-[11px] leading-tight font-bold">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecommendedStoriesSection({
  stories = defaultStories,
  onStoryClick,
  onLike,
  onShare,
}: RecommendedStoriesSectionProps) {
  const [activeTab, setActiveTab] = useState<"trending" | "recent">("recent");

  return (
    <div
      className="animate-fade-in w-full bg-white px-[250px] py-[80px]"
      data-name="Features Block"
      data-node-id="14300:4043"
    >
      <div className="flex w-full flex-col gap-8">
        {/* Header Section */}
        <div className="animate-slide-in-left flex w-full items-end justify-between">
          {/* Left Section - Title */}
          <div className="flex flex-col gap-3">
            {/* Discovery Label */}
            <div
              className="animate-slide-up flex items-center gap-[10.5px]"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-[3.5px] w-[28px] rounded-full bg-blue-600" />
              <p className="text-[12px] font-bold tracking-widest text-blue-600 uppercase">
                Discovery
              </p>
            </div>
            {/* Main Title */}
            <h2
              className="animate-slide-up text-[32px] leading-[48px] font-bold tracking-tight text-gray-900"
              style={{ animationDelay: "0.3s" }}
            >
              Recommended Stories
            </h2>
          </div>

          {/* Right Section - Tabs */}
          <div
            className="animate-slide-in-right flex items-start gap-[14px]"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Trending Tab */}
            <button
              onClick={() => setActiveTab("trending")}
              className={`pb-2 text-[13px] font-bold tracking-tight transition-all duration-300 hover:scale-105 ${
                activeTab === "trending"
                  ? "border-b-0 text-gray-400"
                  : "border-b-0 text-gray-400 hover:text-gray-600"
              }`}
            >
              Trending
            </button>

            {/* Recent Tab */}
            <button
              onClick={() => setActiveTab("recent")}
              className={`border-b-2 pb-2 text-[13px] font-bold tracking-tight transition-all duration-300 hover:scale-105 ${
                activeTab === "recent"
                  ? "border-blue-600 text-gray-900"
                  : "border-transparent text-gray-400"
              }`}
            >
              Recent
            </button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid w-full grid-cols-2 gap-5">
          {stories.map((story, idx) => (
            <StoryCard
              key={story.id}
              story={story}
              onCardClick={onStoryClick}
              onLike={onLike}
              onShare={onShare}
              delay={0.1 + idx * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
