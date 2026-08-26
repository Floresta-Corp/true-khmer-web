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
      className="bg-blue-gray-50 w-full"
      data-name="Features Block"
      data-node-id="14300:4320"
    >
      <div className="flex gap-10 py-10">
        {/* Main Content */}
        <div
          className="flex-1 rounded-lg border border-gray-100 bg-white p-7"
          data-node-id="14300:4323"
        >
          {/* Header with Title and Actions */}
          <div className="mb-6 flex items-start justify-between">
            <h1 className="max-w-md text-[32px] leading-10 font-semibold tracking-tight text-gray-900">
              {title}
            </h1>

            {/* Like and Share Actions */}
            <div className="flex items-center gap-5">
              {/* Likes */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <img
                  alt="like"
                  className="h-[17.5px] w-[17.5px]"
                  src={imgHeart}
                />
                <span className="text-[16px] font-semibold text-gray-700">
                  {likes}
                </span>
              </button>

              {/* Share Icon */}
              <button
                onClick={onShare}
                className="flex h-[21px] w-[21px] items-center justify-center transition-opacity hover:opacity-80"
              >
                <svg
                  viewBox="0 0 21 21"
                  className="h-full w-full"
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
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-6 text-[14px] text-gray-600">
            <span className="font-medium">{duration}</span>
            <span className="h-[3.5px] w-[3.5px] rounded-full bg-gray-300" />
            <span className="font-medium">{views.toLocaleString()} views</span>
            <span className="h-[3.5px] w-[3.5px] rounded-full bg-gray-300" />
            <span className="font-medium">{publishedDate}</span>
          </div>

          {/* About This Story Section */}
          <div className="mb-6">
            <h2 className="mb-4 text-[16px] leading-[20.8px] font-semibold text-gray-900">
              About this story
            </h2>
            <p className="line-clamp-3 text-[15px] leading-[24px] font-medium text-gray-700">
              {description}
            </p>
            <button className="mt-3 text-[13px] font-semibold text-gray-400 transition-colors hover:text-gray-600">
              ...more
            </button>
          </div>

          {/* Read Full Article Button */}
          <button
            onClick={onReadFullArticle}
            className="flex w-full items-center gap-2 border-t border-gray-100 pt-6 text-[14px] font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            <img alt="read" className="h-[14px] w-[14px]" src={imgBookOpen} />
            <span>Read the full documentary article</span>
          </button>
        </div>
        {/* Sidebar - More Stories */}
        <div className="w-80">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[18px] leading-[25.2px] font-semibold text-gray-900">
              More stories
            </h3>
            <button className="text-[13px] font-bold text-gray-400 transition-colors hover:text-gray-600">
              View more
            </button>
          </div>

          {/* Related Stories List */}
          <div className="flex flex-col gap-6">
            {relatedStories.map((story) => (
              <button
                key={story.id}
                onClick={() => onRelatedStoryClick?.(story)}
                className="flex gap-4 text-left transition-opacity hover:opacity-80"
                data-node-id="14300:4372"
              >
                {/* Story Image */}
                <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    alt={story.title}
                    className="h-full w-full object-cover"
                    src={story.image}
                  />
                  {story.duration && (
                    <div className="absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5">
                      <p className="text-[9px] leading-[13.5px] font-bold text-white">
                        {story.duration}
                      </p>
                    </div>
                  )}
                </div>

                {/* Story Info */}
                <div className="flex flex-col gap-1">
                  <h4 className="line-clamp-2 text-[14px] leading-[17.5px] font-bold tracking-tight text-gray-900">
                    {story.title}
                  </h4>
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <span className="text-[11px] leading-[16.5px] font-bold">
                      {story.views.toLocaleString()} views
                    </span>
                    <span className="text-[11px] font-bold">•</span>
                    <span className="text-[11px] leading-[16.5px] font-bold">
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
