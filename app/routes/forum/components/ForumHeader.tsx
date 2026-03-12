import { Search } from "lucide-react";
import AskQuestionDialog from "./AskQuestionDialog";

interface ForumHeaderProps {
  onSearch?: (query: string) => void;
}

export default function ForumHeader({ onSearch }: ForumHeaderProps) {
  return (
    <div className="bg-white flex flex-col gap-8 items-start justify-end px-30 py-14 w-full">
      {/* Header with Title and Button */}
      <div className="flex gap-3 items-end w-full">
        <div className="flex flex-1 flex-col gap-3 items-start">
          {/* Title */}
          <h1 className="font-bold text-5xl leading-15 text-[#0f1729]">
            Forum & Discussions
          </h1>

          {/* Description */}
          <p className="font-medium text-base leading-6 text-[#65758b]">
            Share knowledge, ask questions, and grow with Khmer professionals.
          </p>
        </div>

        {/* Ask Question Button */}
        <AskQuestionDialog />
      </div>

      {/* Search Input */}
      <div className="relative w-2xl">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
          <Search className="size-[17.5px] text-[#9eacc0]" />
        </div>
        <input
          type="text"
          placeholder="Search discussions or categories..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full h-12.75 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl pl-10.5 pr-3.5 py-3.5 font-medium text-sm text-[#9eacc0] placeholder-[#9eacc0] focus:outline-none focus:ring-2 focus:ring-[#2f6fe4] focus:border-transparent"
        />
      </div>
    </div>
  );
}
