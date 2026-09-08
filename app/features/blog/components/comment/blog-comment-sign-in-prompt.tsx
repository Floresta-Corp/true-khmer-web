import { Link, useLocation } from "react-router";

export default function BlogCommentSignInPrompt() {
  const location = useLocation();
  const redirectTo = `${location.pathname}${location.search}`;

  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-[#e2e8f0] bg-white p-6">
      <p className="text-sm text-[#65758b]">
        Join the conversation and share your thoughts on this story.
      </p>
      <Link
        to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        className="text-sm leading-5 font-semibold text-[#0050d4] hover:text-[#0045b8]"
      >
        Sign in to comment
      </Link>
    </div>
  );
}
