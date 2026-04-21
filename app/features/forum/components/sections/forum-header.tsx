import { Search } from "lucide-react";
import AskQuestionDialog from "../dialog/ask-question-dialog";
import type { Category } from "~/services/forum/forum-types";
import { useLoaderData } from "react-router";
import type { loader } from "../../routes/forum";

interface ForumHeaderProps {
  onSearch?: (query: string) => void;
  categories: Category[];
}

export default function ForumHeader({
  onSearch,
  categories,
}: ForumHeaderProps) {
  const { userId } = useLoaderData<typeof loader>();
  const isAuthenticated = Boolean(userId);
  return (
    <div className="max-w-304 mx-auto bg-white flex flex-col gap-6 sm:gap-8 items-start px-4 sm:px-8 lg:px-16 py-8 sm:py-10 lg:py-14">
      {/* Header with Title and Button */}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 sm:items-end w-full">
        <div className="flex flex-1 flex-col gap-2 sm:gap-3 items-start">
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#0f1729]">
            Forum &amp; Discussions
          </h1>
          <p className="font-medium text-sm sm:text-base leading-6 text-[#65758b]">
            Share knowledge, ask questions, and grow with Khmer professionals.
          </p>
        </div>

        <div className="shrink-0 w-full sm:w-auto">
          <AskQuestionDialog
            categories={categories}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:max-w-lg lg:max-w-2xl">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="size-[17.5px] text-[#9eacc0]" />
        </div>
        <input
          type="text"
          placeholder="Search discussions or categories..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full h-11 sm:h-12.75 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl pl-10.5 pr-3.5 font-medium text-sm text-[#9eacc0] placeholder-[#9eacc0] focus:outline-none focus:ring-2 focus:ring-[#2f6fe4] focus:border-transparent transition"
        />
      </div>
    </div>
  );
}
