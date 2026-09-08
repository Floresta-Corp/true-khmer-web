type CommentWrapperVariant = "card" | "compact";

interface CommentWrapperProps {
  children: React.ReactNode;
  isReply?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  /**
   * `card` matches the forum answer cards, `compact` the blog comment rows.
   * The connector offsets differ because they hang off items of different
   * heights.
   */
  variant?: CommentWrapperVariant;
}

const GEOMETRY: Record<
  CommentWrapperVariant,
  {
    branch: string;
    line: { first: string; middle: string; last: string };
    content: { root: string; reply: string; replySpacing: string };
  }
> = {
  card: {
    branch: "top-15 h-5 w-8",
    line: {
      first: "-top-7.5 bottom-0 z-0",
      middle: "-top-6.5 bottom-0",
      last: "-top-6 h-22",
    },
    content: { root: "mt-6", reply: "ml-1", replySpacing: "my-6" },
  },
  compact: {
    // Padding (not margin) keeps the row's top edge at the wrapper's top edge,
    // so the connector offsets below stay predictable.
    branch: "top-0.5 h-4 w-7",
    line: {
      first: "-top-4 bottom-0",
      middle: "-top-4 bottom-0",
      last: "-top-4 h-[34px]",
    },
    content: { root: "mt-6", reply: "ml-1", replySpacing: "pb-6" },
  },
};

const CommentWrapper = ({
  children,
  isReply = false,
  isFirst = false,
  isLast = false,
  variant = "card",
}: CommentWrapperProps) => {
  const geometry = GEOMETRY[variant];
  const timelineClassName = isReply
    ? `${geometry.content.reply} ${!isLast ? geometry.content.replySpacing : ""}`
    : geometry.content.root;

  const getLineClassName = () => {
    if (!isReply) return "";
    const base = "absolute -left-2 w-0.5 bg-slate-200 dark:bg-white/10";
    if (isFirst) return `${base} ${geometry.line.first}`;
    if (!isLast) return `${base} ${geometry.line.middle}`;
    return `${base} ${geometry.line.last}`;
  };

  return (
    <div className="relative w-full pl-5">
      {isReply && <div className={getLineClassName()} />}
      {/* The Curved Arrow (Branch) */}
      {isReply && (
        <div
          className={`absolute -left-2 rounded-bl-xl border-b-2 border-l-2 border-slate-200 dark:border-white/10 ${geometry.branch}`}
        />
      )}
      <div className={timelineClassName}>{children}</div>
    </div>
  );
};

export default CommentWrapper;
