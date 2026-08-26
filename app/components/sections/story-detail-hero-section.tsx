import { ChevronLeft, Heart, Clock, Share2 } from "lucide-react";
import { useState } from "react";

interface StoryDetailHeroSectionProps {
  videoSrc?: string;
  imageSrc?: string;
  onBack?: () => void;
  onWatchVideo?: () => void;
  onReadFullStory?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  badges?: {
    text: string;
    label: string;
  }[];
  awards?: {
    title: string;
    year: string;
  }[];
}

const imgImageWithFallback =
  "http://localhost:3845/assets/2f660cb7461daff1ea5fedd3dd4a3da1dac82898.png";
const imgChevronLeft =
  "http://localhost:3845/assets/bc331f2a791ae9c2255d1d5b4bad3c38849e18b0.svg";
const imgVideo =
  "http://localhost:3845/assets/8673ec2a49e11e07466866e9f3451b5062f12855.svg";
const imgBookOpen =
  "http://localhost:3845/assets/66f5d61560e83c04426006b5d659e60e0a427962.svg";

export function StoryDetailHeroSection({
  imageSrc = imgImageWithFallback,
  onBack,
  onWatchVideo,
  onReadFullStory,
  onLike,
  onShare,
  badges = [{ text: "True Khmer", label: "Staff Pick" }],
  awards = [
    { title: "Official Selection", year: "ANNECY" },
    { title: "First Prize", year: "PUNTO Y RAYA" },
  ],
}: StoryDetailHeroSectionProps) {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  return (
    <div
      className="animate-fade-in flex w-full flex-col gap-4 px-[112px] pt-8"
      data-name="Features Block"
      data-node-id="14300:4262"
    >
      {/* Header with Back and Action Buttons */}
      <div className="animate-slide-in-left flex w-full items-center justify-between">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-[7px] text-gray-400 transition-all duration-300 hover:gap-3 hover:text-gray-600"
          data-node-id="14300:4264"
        >
          <img alt="back" className="h-[14px] w-[14px]" src={imgChevronLeft} />
          <span className="text-[13px] leading-[19.5px] font-semibold">
            Back to stories
          </span>
        </button>

        {/* Action Buttons */}
        <div
          className="animate-slide-in-right flex items-center gap-1 rounded-full border border-gray-100 bg-white px-1 py-1 shadow-sm"
          data-node-id="14300:4269"
        >
          {/* Watch Video Button */}
          <button
            onClick={onWatchVideo}
            className="flex flex-1 items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
            data-node-id="14300:4270"
          >
            <img alt="play" className="h-[14px] w-[14px]" src={imgVideo} />
            <span className="text-[13px] leading-[19.5px] font-bold">
              Watch Video
            </span>
          </button>

          {/* Read Full Story Button */}
          <button
            onClick={onReadFullStory}
            className="flex items-center gap-2 rounded-full px-2 py-[7px] text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900"
            data-node-id="14300:4275"
          >
            <img alt="read" className="h-[14px] w-[14px]" src={imgBookOpen} />
            <span className="text-[13px] leading-[19.5px] font-bold">
              Read Full Story
            </span>
          </button>
        </div>
      </div>

      {/* Video/Image Container */}
      <div
        className="animate-scale-in relative h-[596px] w-full overflow-hidden rounded-xl bg-black shadow-2xl"
        data-node-id="14300:4280"
      >
        {/* Background Image */}
        <img
          alt="story"
          className="absolute inset-0 h-full w-full object-cover"
          src={imageSrc}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Badge - True Khmer Staff Pick */}
        <div
          className="animate-slide-in-left absolute top-5 left-5 flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full border-2 border-white p-2 text-center text-white"
          style={{ animationDelay: "0.2s" }}
          data-node-id="14300:4283"
        >
          <p className="text-[10px] leading-[10px] font-black tracking-[-0.5px] uppercase">
            True Khmer
          </p>
          <p className="mt-1 text-[12px] leading-[12px] font-black tracking-[1.2px] uppercase">
            Staff
          </p>
          <p className="text-[12px] leading-[12px] font-black tracking-[1.2px] uppercase">
            Pick
          </p>
        </div>

        {/* Award Badges */}
        <div className="absolute top-5 left-[126px] flex gap-3">
          {awards.map((award, idx) => (
            <div
              key={idx}
              className="animate-slide-up flex min-w-[56px] flex-col items-center justify-center rounded-full border border-white/30 bg-black/20 px-3 py-2"
              style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
            >
              <p className="text-[6px] leading-[9px] font-bold text-white uppercase">
                {award.title}
              </p>
              <p className="mt-0.5 text-[10px] leading-[15px] font-black text-white uppercase">
                {award.year}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side Action Buttons */}
        <div className="absolute top-5 right-5 flex flex-col gap-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`animate-slide-in-right flex h-[17.5px] w-[17.5px] items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-125 ${
              liked ? "bg-red-500" : "bg-white"
            }`}
            style={{ animationDelay: "0.4s" }}
            data-node-id="14300:4306"
          >
            <Heart
              size={12}
              className={liked ? "fill-white text-white" : "text-gray-600"}
            />
          </button>

          {/* Clock/Time Button */}
          <button
            className="animate-slide-in-right flex h-[17.5px] w-[17.5px] items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-125 hover:bg-gray-100"
            style={{ animationDelay: "0.5s" }}
            data-node-id="14300:4309"
          >
            <Clock size={12} className="text-gray-600" />
          </button>

          {/* Share Button */}
          <button
            onClick={onShare}
            className="animate-slide-in-right flex h-[17.5px] w-[17.5px] items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-125 hover:bg-gray-100"
            style={{ animationDelay: "0.6s" }}
            data-node-id="14300:4313"
          >
            <Share2 size={12} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
