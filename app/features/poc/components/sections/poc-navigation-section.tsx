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
      className="flex w-full items-center justify-between pb-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <BackToButton to="/poc" />
      <motion.div
        className="flex items-center gap-1 rounded-full border border-gray-100 bg-white px-1 py-1 shadow-sm"
        data-node-id="14300:4269"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        {/* Watch Video Button */}
        <button
          onClick={onWatchVideo}
          className="flex flex-1 items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
          data-node-id="14300:4270"
        >
          <img alt="play" className="h-3.5 w-3.5" src={imgVideo} />
          <span className="text-[13px] leading-[19.5px] font-bold">
            Watch Video
          </span>
        </button>

        {/* Read Full Story Button */}
        <button
          onClick={onReadFullStory}
          className="flex items-center gap-2 rounded-full px-2 py-1.75 text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-gray-900"
          data-node-id="14300:4275"
        >
          <img alt="read" className="h-3.5 w-3.5" src={imgBookOpen} />
          <span className="text-[13px] leading-[19.5px] font-bold">
            Read Full Story
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
