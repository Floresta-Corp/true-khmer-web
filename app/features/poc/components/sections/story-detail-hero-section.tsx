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
      className="flex w-full flex-col gap-4"
      data-name="Features Block"
      data-node-id="14300:4262"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Video/Image Container */}
      <motion.div
        className="relative h-149 w-full overflow-hidden rounded-xl bg-black shadow-2xl"
        data-node-id="14300:4280"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
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
        <motion.div
          className="absolute top-5 left-5 flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full border-2 border-white p-2 text-center text-white"
          data-node-id="14300:4283"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...easeOut, delay: 0.2 }}
        >
          <p className="text-[10px] leading-2.5 font-black tracking-[-0.5px] uppercase">
            True Khmer
          </p>
          <p className="mt-1 text-[12px] leading-[12px] font-black tracking-[1.2px] uppercase">
            Staff
          </p>
          <p className="text-[12px] leading-[12px] font-black tracking-[1.2px] uppercase">
            Pick
          </p>
        </motion.div>

        {/* Award Badges */}
        <div className="absolute top-5 left-31.5 flex gap-3">
          {awards.map((award, idx) => (
            <motion.div
              key={idx}
              className="flex min-w-[56px] flex-col items-center justify-center rounded-full border border-white/30 bg-black/20 px-3 py-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...easeOut, delay: 0.3 + idx * 0.1 }}
            >
              <p className="text-[6px] leading-[9px] font-bold text-white uppercase">
                {award.title}
              </p>
              <p className="mt-0.5 text-[10px] leading-[15px] font-black text-white uppercase">
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
            className={`flex h-[17.5px] w-[17.5px] items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-125 ${
              liked ? "bg-red-500" : "bg-white"
            }`}
            data-node-id="14300:4306"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...easeOut, delay: 0.4 }}
          >
            <Heart
              size={12}
              className={liked ? "fill-white text-white" : "text-gray-600"}
            />
          </motion.button>

          {/* Clock/Time Button */}
          <motion.button
            className="flex h-[17.5px] w-[17.5px] items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-125 hover:bg-gray-100"
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
            className="flex h-[17.5px] w-[17.5px] items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-125 hover:bg-gray-100"
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
