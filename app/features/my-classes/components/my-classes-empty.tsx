import { Link } from "react-router";
import { BookmarkPlus, GraduationCap, Search, Trophy } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { MyClassTab } from "~/features/my-classes/types";

type EmptyCopy = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
};

const BY_TAB: Record<MyClassTab, EmptyCopy> = {
  learning: {
    icon: GraduationCap,
    title: "No classes yet",
    body: "Join a course from the Education Center and it will show up here, ready to pick up whenever you are.",
  },
  "in-progress": {
    icon: GraduationCap,
    title: "Nothing in progress",
    body: "Open a lesson on one of your courses and it moves into this tab.",
  },
  saved: {
    icon: BookmarkPlus,
    title: "Nothing saved",
    body: "Save a course while you are browsing and it waits here until you are ready to start.",
  },
  completed: {
    icon: Trophy,
    title: "No completed courses yet",
    body: "Finish every lesson on a course and it lands here, with its certificate.",
  },
};

export function MyClassesEmpty({
  tab,
  search,
  onClearSearch,
}: {
  tab: MyClassTab;
  search: string;
  onClearSearch: () => void;
}) {
  if (search) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#f1f5f9] text-[#8A94A6]">
          <Search size={22} aria-hidden />
        </span>
        <h3 className="text-base font-bold text-[#1A1A2E]">
          No courses match “{search}”
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-[#8A94A6]">
          Try a different title, or clear the search to see everything in this
          tab.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="mt-5"
          onClick={onClearSearch}
        >
          Clear search
        </Button>
      </div>
    );
  }

  const copy = BY_TAB[tab];
  const Icon = copy.icon;

  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#2F6FE4]">
        <Icon size={22} aria-hidden />
      </span>
      <h3 className="text-base font-bold text-[#1A1A2E]">{copy.title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#8A94A6]">{copy.body}</p>
      <Button asChild size="lg" className="mt-5">
        <Link to="/education">Browse courses</Link>
      </Button>
    </div>
  );
}
