import { motion } from "motion/react";
import BackToButton from "~/components/back-to-button";

interface PocNavigationSectionProps {
  onWatchVideo?: () => void;
  onReadFullStory?: () => void;
}

const imgVideo =
  "http://localhost:3845/assets/8673ec2a49e11e07466866e9f3451b5062f12855.svg";
const imgBookOpen =
  "http://localhost:3845/assets/66f5d61560e83c04426006b5d659e60e0a427962.svg";

export function PocNavigationSection({
  onWatchVideo,
  onReadFullStory,
}: PocNavigationSectionProps) {
  return (
    <motion.div
      className="flex items-center justify-between w-full pb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <BackToButton to="/poc" />
      <motion.div
        className="flex items-center gap-1 bg-white border border-gray-100 rounded-full px-1 py-1 shadow-sm"
        data-node-id="14300:4269"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        {/* Watch Video Button */}
        <button
          onClick={onWatchVideo}
          className="flex-1 flex items-center gap-2 bg-blue-600 text-white rounded-full px-5 py-2 hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          data-node-id="14300:4270"
        >
          <img alt="play" className="w-3.5 h-3.5" src={imgVideo} />
          <span className="font-bold text-[13px] leading-[19.5px]">
            Watch Video
          </span>
        </button>

        {/* Read Full Story Button */}
        <button
          onClick={onReadFullStory}
          className="flex items-center gap-2 text-gray-600 px-2 py-1.75 rounded-full hover:bg-gray-50 transition-all duration-300 hover:text-gray-900"
          data-node-id="14300:4275"
        >
          <img alt="read" className="w-3.5 h-3.5" src={imgBookOpen} />
          <span className="font-bold text-[13px] leading-[19.5px]">
            Read Full Story
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
