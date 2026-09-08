import { Link, useLocation } from "react-router";

export default function BlogCommentSignInPrompt() {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  return (
    <div className="mt-6 flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-[14px] text-slate-600 dark:text-slate-300">
        Join the conversation and share your thoughts on this story.
      </p>
      <Link
        to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        className="text-[13px] font-semibold text-[#0082e1] hover:underline"
      >
        Sign in to comment
      </Link>
    </div>
  );
}
