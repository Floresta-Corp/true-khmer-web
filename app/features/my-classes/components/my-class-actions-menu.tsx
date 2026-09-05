import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import {
  Award,
  Bookmark,
  BookmarkX,
  Eye,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { MyClass, MyClassIntent } from "~/features/my-classes/types";

const DONE: Record<MyClassIntent, string> = {
  save: "Saved to your list.",
  unsave: "Removed from saved.",
  leave: "You have left the course.",
};

export function MyClassActionsMenu({ course }: { course: MyClass }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const busy = fetcher.state !== "idle";
  const announced = useRef<unknown>(null);
  const lastIntent = useRef<MyClassIntent | null>(null);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);

  const submitIntent = (intent: MyClassIntent) => {
    lastIntent.current = intent;
    fetcher.submit(
      { intent, courseId: course.courseId },
      { method: "post", action: "/my-classes" },
    );
  };

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (announced.current === fetcher.data) return;
    announced.current = fetcher.data;

    if (fetcher.data.ok) {
      toast.success(DONE[lastIntent.current ?? "save"]);
      return;
    }

    toast.error(fetcher.data.error ?? "That change could not be saved.");
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions for ${course.title}`}
          disabled={busy}
          className="relative z-10 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50"
        >
          <MoreVertical size={18} aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuItem asChild>
            <Link to={`/education/${course.courseId}`}>
              <Eye size={16} aria-hidden />
              View course page
            </Link>
          </DropdownMenuItem>

          {course.certificateEarned && (
            <DropdownMenuItem asChild>
              <Link to={`/education/${course.courseId}/certificate`}>
                <Award size={16} aria-hidden />
                View certificate
              </Link>
            </DropdownMenuItem>
          )}

          {course.isSaved ? (
            <DropdownMenuItem onSelect={() => submitIntent("unsave")}>
              <BookmarkX size={16} aria-hidden />
              Remove from saved
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => submitIntent("save")}>
              <Bookmark size={16} aria-hidden />
              Save for later
            </DropdownMenuItem>
          )}

          {course.isEnrolled && (
            <DropdownMenuItem
              className="text-[#DC2626] focus:bg-red-50 focus:text-[#DC2626]"
              onSelect={() => setIsLeaveOpen(true)}
            >
              <Trash2 size={16} aria-hidden />
              Leave course
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isLeaveOpen} onOpenChange={setIsLeaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave “{course.title}”?</DialogTitle>
            <DialogDescription>
              {course.lessonsCompleted > 0
                ? `Your progress on ${course.lessonsCompleted} of ${course.lessonCount} lessons will be deleted. You can enrol again, but you will start from the beginning.`
                : "You can enrol again at any time from the course page."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLeaveOpen(false)}
              disabled={busy}
            >
              Keep course
            </Button>
            <Button
              className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
              disabled={busy}
              onClick={() => {
                setIsLeaveOpen(false);
                submitIntent("leave");
              }}
            >
              Leave course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
