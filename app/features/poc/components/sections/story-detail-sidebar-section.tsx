import { Heart, BookOpen } from "lucide-react";
import { useState } from "react";

interface RelatedStory {
  id: string;
  title: string;
  author?: string;
  views: number;
  duration?: string;
  image: string;
}

interface StoryDetailSidebarSectionProps {
  title: string;
  duration: string;
  views: number;
  publishedDate: string;
  likes: number;
  description: string;
  onReadFullArticle?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  relatedStories?: RelatedStory[];
  onRelatedStoryClick?: (story: RelatedStory) => void;
}

const imgHeart =
  "http://localhost:3845/assets/0d191d192073aeb6399e6c9baad262ac4abf1e29.svg";
const imgBookOpen =
  "http://localhost:3845/assets/0458d0ab42c6802967ab91cc63aa504398c9e7e1.svg";

const defaultRelatedStories: RelatedStory[] = [
  {
    id: "1",
    title: "The weaver of silk",
    author: "Srey Leak",
    views: 1200,
    duration: "4:20",
    image:
      "http://localhost:3845/assets/2f660cb7461daff1ea5fedd3dd4a3da1dac82898.png",
  },
  {
    id: "2",
    title: "Sustainable farming in Battambang",
    author: "Sokha",
    views: 850,
    duration: "5:30",
    image:
      "http://localhost:3845/assets/9607c20d8e9b9501dd191b182102046f7727d716.png",
  },
  {
    id: "3",
    title: "Traditional boat builders of Tonle Sap",
    author: "Thy",
    views: 2100,
    duration: "6:15",
    image:
      "http://localhost:3845/assets/f48a63379fd2e19d30fd4703cbb8bc55aeea9c1f.png",
  },
];

export function StoryDetailSidebarSection({
  title,
  duration,
  views,
  publishedDate,
  likes,
  description,
  onReadFullArticle,
  onLike,
  onShare,
  relatedStories = defaultRelatedStories,
  onRelatedStoryClick,
}: StoryDetailSidebarSectionProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  return (
    <div
      className="w-full bg-blue-gray-50"
      data-name="Features Block"
      data-node-id="14300:4320"
    >
      <div className="py-10 flex gap-10">
        {/* Main Content */}
        <div
          className="flex-1 bg-white border border-gray-100 rounded-lg p-7"
          data-node-id="14300:4323"
        >
          {/* Header with Title and Actions */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-[32px] font-semibold text-gray-900 leading-10 tracking-tight max-w-md">
              {title}
            </h1>

            {/* Like and Share Actions */}
            <div className="flex items-center gap-5">
              {/* Likes */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  alt="like"
                  className="w-[17.5px] h-[17.5px]"
                  src={imgHeart}
                />
                <span className="font-semibold text-[16px] text-gray-700">
                  {likes}
                </span>
              </button>

              {/* Share Icon */}
              <button
                onClick={onShare}
                className="w-[21px] h-[21px] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <svg
                  viewBox="0 0 21 21"
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="3" cy="10.5" r="2" />
                  <circle cx="18" cy="10.5" r="2" />
                  <circle cx="10.5" cy="3" r="2" />
                  <path d="M5 9l5.5-5.5M16 12l-5.5 5.5M5 12l5.5-5.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-3 text-gray-600 text-[14px] mb-6 pb-6 border-b border-gray-100">
            <span className="font-medium">{duration}</span>
            <span className="w-[3.5px] h-[3.5px] bg-gray-300 rounded-full" />
            <span className="font-medium">{views.toLocaleString()} views</span>
            <span className="w-[3.5px] h-[3.5px] bg-gray-300 rounded-full" />
            <span className="font-medium">{publishedDate}</span>
          </div>

          {/* About This Story Section */}
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold text-gray-900 mb-4 leading-[20.8px]">
              About this story
            </h2>
            <p className="text-[15px] font-medium text-gray-700 leading-[24px] line-clamp-3">
              {description}
            </p>
            <button className="text-gray-400 text-[13px] font-semibold mt-3 hover:text-gray-600 transition-colors">
              ...more
            </button>
          </div>

          {/* Read Full Article Button */}
          <button
            onClick={onReadFullArticle}
            className="w-full pt-6 border-t border-gray-100 flex items-center gap-2 text-blue-600 font-bold text-[14px] hover:text-blue-700 transition-colors"
          >
            <img alt="read" className="w-[14px] h-[14px]" src={imgBookOpen} />
            <span>Read the full documentary article</span>
          </button>
        </div>
        {/* Sidebar - More Stories */}
        <div className="w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-semibold text-gray-900 leading-[25.2px]">
              More stories
            </h3>
            <button className="text-gray-400 font-bold text-[13px] hover:text-gray-600 transition-colors">
              View more
            </button>
          </div>

          {/* Related Stories List */}
          <div className="flex flex-col gap-6">
            {relatedStories.map((story) => (
              <button
                key={story.id}
                onClick={() => onRelatedStoryClick?.(story)}
                className="flex gap-4 hover:opacity-80 transition-opacity text-left"
                data-node-id="14300:4372"
              >
                {/* Story Image */}
                <div className="w-28 h-16 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 relative">
                  <img
                    alt={story.title}
                    className="w-full h-full object-cover"
                    src={story.image}
                  />
                  {story.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                      <p className="text-white font-bold text-[9px] leading-[13.5px]">
                        {story.duration}
                      </p>
                    </div>
                  )}
                </div>

                {/* Story Info */}
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-[14px] text-gray-900 leading-[17.5px] tracking-tight line-clamp-2">
                    {story.title}
                  </h4>
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <span className="text-[11px] font-bold leading-[16.5px]">
                      {story.views.toLocaleString()} views
                    </span>
                    <span className="text-[11px] font-bold">•</span>
                    <span className="text-[11px] font-bold leading-[16.5px]">
                      {story.author}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
