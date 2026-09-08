interface CommentWrapperProps {
  children: React.ReactNode;
  isReply?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const CommentWrapper = ({
  children,
  isReply = false,
  isFirst = false,
  isLast = false,
}: CommentWrapperProps) => {
  const timelineClassName = isReply ? `ml-1 ${!isLast ? "my-6" : ""}` : "mt-6";

  // Determine timeline line styling based on position
  const getLineClassName = () => {
    if (!isReply) return "";
    if (isFirst)
      return "absolute -left-2 w-0.5 bg-slate-200 -top-7.5 bottom-0 z-0";
    if (!isLast) return "absolute -left-2 w-0.5 bg-slate-200 -top-6.5 bottom-0";
    return `absolute -left-2 w-0.5 bg-slate-200 -top-6 h-22`;
  };

  return (
    <div className="relative w-full pl-5">
      {isReply && <div className={getLineClassName()} />}
      {/* The Curved Arrow (Branch) */}
      {isReply && (
        <div className="absolute top-15 -left-2 h-5 w-8 rounded-bl-xl border-b-2 border-l-2 border-slate-200" />
      )}
      <div className={timelineClassName}>{children}</div>
    </div>
  );
};

export default CommentWrapper;
