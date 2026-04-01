import { Link } from "react-router";

interface BackToStoriesProps {
  className?: string;
}

const imgChevronLeft =
  "http://localhost:3845/assets/bc331f2a791ae9c2255d1d5b4bad3c38849e18b0.svg";

export function BackToStories({ className = "" }: BackToStoriesProps) {
  return (
    <Link
      to="/poc"
      className={`flex items-center gap-1.75 text-gray-400 hover:text-gray-600 transition-colors duration-300 ${className}`}
      data-node-id="14300:4264"
    >
      <img alt="back" className="w-3.5 h-3.5" src={imgChevronLeft} />
      <span className="font-semibold text-[13px] leading-[19.5px]">
        Back to stories
      </span>
    </Link>
  );
}
