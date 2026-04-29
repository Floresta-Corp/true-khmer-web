import { Eye, Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

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

function StoryCard({ story, onCardClick, onLike, onShare }: any) {
  return (
    <Link to={`/poc/detail/${story.id}`}>
      <div
        className="flex flex-col gap-5.25 cursor-pointer"
        onClick={() => onCardClick?.(story)}
        data-node-id="story-card"
      >
        {/* Image Container */}
        <div className="relative h-72.25 rounded-[14px] overflow-hidden bg-gray-100 shadow-sm shrink-0">
          <img
            alt={story.title}
            className="w-full h-full object-cover"
            src={story.image}
          />
          {/* Duration Badge */}
          {story.duration && (
            <div className="absolute bottom-5 right-3.5 bg-black/60 rounded-lg px-2 py-1">
              <p className="text-white font-bold text-[11px] leading-tight">
                {story.duration}
              </p>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <h3 className="font-bold text-[17px] text-gray-900 leading-tight tracking-tight line-clamp-1">
              {story.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 font-medium text-[14px] leading-[22.75px] tracking-tight line-clamp-2">
            {story.description}
          </p>

          {/* Engagement Metrics */}
          <div className="flex gap-5.25 items-center text-gray-500">
            {/* Views */}
            <div className="flex items-center gap-1.25">
              <img alt="views" className="w-3.5 h-3.5" src={imgEye} />
              <span className="text-[11px] font-bold leading-tight">
                {story.views > 1000
                  ? `${(story.views / 1000).toFixed(1)}k`
                  : story.views}
              </span>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1.25">
              <img
                alt="likes"
                className="w-3.5 h-3.5 cursor-pointer hover:opacity-80"
                src={imgHeart}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.(story.id);
                }}
              />
              <span className="text-[11px] font-bold leading-tight">
                {story.likes}
              </span>
            </div>

            {/* Shares */}
            <div className="flex items-center gap-[5px]">
              <img
                alt="shares"
                className="w-[14px] h-[14px] cursor-pointer hover:opacity-80"
                src={imgShare2}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(story.id);
                }}
              />
              <span className="text-[11px] font-bold leading-tight">Share</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
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
      className="w-full bg-white px-[250px] py-[80px]"
      data-name="Features Block"
      data-node-id="14300:4043"
    >
      <div className="flex flex-col gap-8 w-full">
        {/* Header Section */}
        <div className="flex items-end justify-between w-full">
          {/* Left Section - Title */}
          <div className="flex flex-col gap-3">
            {/* Discovery Label */}
            <div className="flex items-center gap-[10.5px]">
              <div className="w-[28px] h-[3.5px] bg-blue-600 rounded-full" />
              <p className="text-blue-600 font-bold text-[12px] uppercase tracking-widest">
                Discovery
              </p>
            </div>
            {/* Main Title */}
            <h2 className="font-bold text-[32px] leading-[48px] text-gray-900 tracking-tight">
              Recommended Stories
            </h2>
          </div>

          {/* Right Section - Tabs */}
          <div className="flex gap-[14px] items-start">
            {/* Trending Tab */}
            <button
              onClick={() => setActiveTab("trending")}
              className={`pb-2 font-bold text-[13px] tracking-tight transition-colors ${activeTab === "trending"
                  ? "text-gray-400 border-b-0"
                  : "text-gray-400 border-b-0 hover:text-gray-600"
                }`}
            >
              Trending
            </button>

            {/* Recent Tab */}
            <button
              onClick={() => setActiveTab("recent")}
              className={`pb-2 font-bold text-[13px] tracking-tight transition-colors border-b-2 ${activeTab === "recent"
                  ? "text-gray-900 border-blue-600"
                  : "text-gray-400 border-transparent"
                }`}
            >
              Recent
            </button>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 gap-5 w-full">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onCardClick={onStoryClick}
              onLike={onLike}
              onShare={onShare}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
