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
      className="w-full flex flex-col gap-4 px-[112px] pt-8 animate-fade-in"
      data-name="Features Block"
      data-node-id="14300:4262"
    >
      {/* Header with Back and Action Buttons */}
      <div className="flex items-center justify-between w-full animate-slide-in-left">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-[7px] text-gray-400 hover:text-gray-600 transition-all duration-300 hover:gap-3"
          data-node-id="14300:4264"
        >
          <img
            alt="back"
            className="w-[14px] h-[14px]"
            src={imgChevronLeft}
          />
          <span className="font-semibold text-[13px] leading-[19.5px]">
            Back to stories
          </span>
        </button>

        {/* Action Buttons */}
        <div
          className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-1 py-1 shadow-sm animate-slide-in-right"
          data-node-id="14300:4269"
        >
          {/* Watch Video Button */}
          <button
            onClick={onWatchVideo}
            className="flex-1 flex items-center gap-2 bg-blue-600 text-white rounded-full px-5 py-2 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
            data-node-id="14300:4270"
          >
            <img
              alt="play"
              className="w-[14px] h-[14px]"
              src={imgVideo}
            />
            <span className="font-bold text-[13px] leading-[19.5px]">
              Watch Video
            </span>
          </button>

          {/* Read Full Story Button */}
          <button
            onClick={onReadFullStory}
            className="flex items-center gap-2 text-gray-600 px-2 py-[7px] rounded-full hover:bg-gray-50 transition-all duration-300 hover:text-gray-900"
            data-node-id="14300:4275"
          >
            <img
              alt="read"
              className="w-[14px] h-[14px]"
              src={imgBookOpen}
            />
            <span className="font-bold text-[13px] leading-[19.5px]">
              Read Full Story
            </span>
          </button>
        </div>
      </div>

      {/* Video/Image Container */}
      <div
        className="relative w-full h-[596px] rounded-xl overflow-hidden shadow-2xl bg-black animate-scale-in"
        data-node-id="14300:4280"
      >
        {/* Background Image */}
        <img
          alt="story"
          className="absolute inset-0 w-full h-full object-cover"
          src={imageSrc}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Badge - True Khmer Staff Pick */}
        <div
          className="absolute top-5 left-5 border-2 border-white rounded-full w-[84px] h-[84px] flex flex-col items-center justify-center text-white text-center p-2 animate-slide-in-left"
          style={{ animationDelay: "0.2s" }}
          data-node-id="14300:4283"
        >
          <p className="font-black text-[10px] leading-[10px] uppercase tracking-[-0.5px]">
            True Khmer
          </p>
          <p className="font-black text-[12px] leading-[12px] uppercase tracking-[1.2px] mt-1">
            Staff
          </p>
          <p className="font-black text-[12px] leading-[12px] uppercase tracking-[1.2px]">
            Pick
          </p>
        </div>

        {/* Award Badges */}
        <div className="absolute top-5 left-[126px] flex gap-3">
          {awards.map((award, idx) => (
            <div
              key={idx}
              className="bg-black/20 border border-white/30 rounded-full px-3 py-2 flex flex-col items-center justify-center min-w-[56px] animate-slide-up"
              style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
            >
              <p className="text-white font-bold text-[6px] uppercase leading-[9px]">
                {award.title}
              </p>
              <p className="text-white font-black text-[10px] uppercase leading-[15px] mt-0.5">
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
            className={`w-[17.5px] h-[17.5px] flex items-center justify-center rounded-full shadow-lg transition-all duration-300 animate-slide-in-right hover:scale-125 ${
              liked ? "bg-red-500" : "bg-white"
            }`}
            style={{ animationDelay: "0.4s" }}
            data-node-id="14300:4306"
          >
            <Heart
              size={12}
              className={liked ? "text-white fill-white" : "text-gray-600"}
            />
          </button>

          {/* Clock/Time Button */}
          <button
            className="w-[17.5px] h-[17.5px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300 animate-slide-in-right hover:scale-125"
            style={{ animationDelay: "0.5s" }}
            data-node-id="14300:4309"
          >
            <Clock size={12} className="text-gray-600" />
          </button>

          {/* Share Button */}
          <button
            onClick={onShare}
            className="w-[17.5px] h-[17.5px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300 animate-slide-in-right hover:scale-125"
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
