interface ForumDetailQuestionHeaderProps {
  authorName: string;
  authorAvatar: string;
  category: string;
  postedAt: string;
}

export default function ForumDetailQuestionHeader({
  authorName,
  authorAvatar,
  category,
  postedAt,
}: ForumDetailQuestionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={authorAvatar}
          alt={authorName}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div className="flex min-w-0 items-center gap-2 text-sm leading-5">
          <p className="truncate font-semibold text-[#2c2f31]">
            {authorName}
          </p>
          <span className="text-[#abadaf]">•</span>
          <p className="truncate text-[#595c5e]">
            {category}
          </p>
          <p className="truncate text-[#595c5e]">• {postedAt}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm font-semibold text-[#9eacc0]">
        <button
          type="button"
          className="transition-colors hover:text-[#6b7280]"
        >
          Save
        </button>
        <button
          type="button"
          className="transition-colors hover:text-[#6b7280]"
        >
          Report
        </button>
      </div>
    </div>
  );
}
