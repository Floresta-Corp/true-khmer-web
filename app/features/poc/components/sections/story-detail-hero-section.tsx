import { Heart, Clock, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface StoryDetailHeroSectionProps {
  videoSrc?: string;
  imageSrc?: string;
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

export function StoryDetailHeroSection({
  imageSrc = imgImageWithFallback,
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

  const easeOut = { duration: 0.5, ease: "easeOut" as const };

  return (
    <motion.div
      className="w-full flex flex-col gap-4"
      data-name="Features Block"
      data-node-id="14300:4262"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Video/Image Container */}
      <motion.div
        className="relative w-full h-149 rounded-xl overflow-hidden shadow-2xl bg-black"
        data-node-id="14300:4280"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
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
        <motion.div
          className="absolute top-5 left-5 border-2 border-white rounded-full w-[84px] h-[84px] flex flex-col items-center justify-center text-white text-center p-2"
          data-node-id="14300:4283"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...easeOut, delay: 0.2 }}
        >
          <p className="font-black text-[10px] leading-2.5 uppercase tracking-[-0.5px]">
            True Khmer
          </p>
          <p className="font-black text-[12px] leading-[12px] uppercase tracking-[1.2px] mt-1">
            Staff
          </p>
          <p className="font-black text-[12px] leading-[12px] uppercase tracking-[1.2px]">
            Pick
          </p>
        </motion.div>

        {/* Award Badges */}
        <div className="absolute top-5 left-31.5 flex gap-3">
          {awards.map((award, idx) => (
            <motion.div
              key={idx}
              className="bg-black/20 border border-white/30 rounded-full px-3 py-2 flex flex-col items-center justify-center min-w-[56px]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeOut, delay: 0.3 + idx * 0.1 }}
            >
              <p className="text-white font-bold text-[6px] uppercase leading-[9px]">
                {award.title}
              </p>
              <p className="text-white font-black text-[10px] uppercase leading-[15px] mt-0.5">
                {award.year}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right Side Action Buttons */}
        <div className="absolute top-5 right-5 flex flex-col gap-3">
          {/* Like Button */}
          <motion.button
            onClick={handleLike}
            className={`w-[17.5px] h-[17.5px] flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-125 ${
              liked ? "bg-red-500" : "bg-white"
            }`}
            data-node-id="14300:4306"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...easeOut, delay: 0.4 }}
          >
            <Heart
              size={12}
              className={liked ? "text-white fill-white" : "text-gray-600"}
            />
          </motion.button>

          {/* Clock/Time Button */}
          <motion.button
            className="w-[17.5px] h-[17.5px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-125"
            data-node-id="14300:4309"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...easeOut, delay: 0.5 }}
          >
            <Clock size={12} className="text-gray-600" />
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={onShare}
            className="w-[17.5px] h-[17.5px] bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all duration-300 hover:scale-125"
            data-node-id="14300:4313"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...easeOut, delay: 0.6 }}
          >
            <Share2 size={12} className="text-gray-600" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
