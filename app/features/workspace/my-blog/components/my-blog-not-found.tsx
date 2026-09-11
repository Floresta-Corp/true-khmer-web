import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function MyBlogNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">
        Blog not found
      </h1>
      <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        This blog either does not exist or belongs to another author.
      </p>
      <Button asChild className="mt-2">
        <Link to="/workspace/khmer-voices">Back to my blogs</Link>
      </Button>
    </div>
  );
}
