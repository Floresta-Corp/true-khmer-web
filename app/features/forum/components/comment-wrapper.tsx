import React from "react";

interface CommentWrapperProps {
  children: React.ReactNode;
  isReply?: boolean;
  isLast?: boolean;
}

const CommentWrapper = ({
  children,
  isReply = false,
  isLast = false,
}: CommentWrapperProps) => {
  return (
    <div className="relative w-full">
      {/* The Vertical "Spine" Line */}
      {/* We only hide the bottom half of the line if it's the last child */}
      {isReply && (
        <div
          className={`absolute left-[-26px] w-px bg-slate-200 ${
            isLast ? "top-0 h-5" : "top-0 bottom-0"
          }`}
        />
      )}

      {/* The Curved Arrow (Branch) */}
      {isReply && (
        <div className="absolute left-[-26px] top-5 w-5 h-5 border-l border-b border-slate-200 rounded-bl-xl" />
      )}

      <div className={`${isReply ? "ml-8" : ""}`}>{children}</div>
    </div>
  );
};

export default CommentWrapper;
