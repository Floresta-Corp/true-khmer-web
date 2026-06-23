import * as React from "react";
import { Link } from "react-router";
import { Eye, Link2, MoreVertical, PenLine, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function PageHeader({
  isPublicView,
  onToggleView,
  profileId,
}: {
  isPublicView: boolean;
  onToggleView: () => void;
  profileId?: string | null;
}) {
  const [open, setOpen] = React.useState(false);

  const handleShareProfileLink = async () => {
    const shareUrl = profileId
      ? `${window.location.origin}/profile/${profileId}`
      : window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Profile link copied to clipboard.");
    } catch {
      toast.error("Failed to copy profile link.");
    }

    setOpen(false);
  };

  return (
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-[40px] font-extrabold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
          {isPublicView ? "Public Profile" : "My Space"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-base sm:text-lg">
          {isPublicView
            ? "This is how you appear to other members of the Khmer community."
            : "Visualize your growth and community contributions."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isPublicView ? (
          <Button
            variant="outline"
            className="h-12 rounded-xl px-5"
            onClick={onToggleView}
          >
            <X className="h-4 w-4" />
            <span className="font-semibold">Close public profile</span>
          </Button>
        ) : (
          <>
            <Button variant="outline" className="h-12 rounded-xl px-5" asChild>
              <Link to="/edit-profile">
                <PenLine /> <p className="font-semibold">Edit Profile</p>
              </Link>
            </Button>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl cursor-pointer"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full justify-start gap-2 px-3 font-normal"
                  onClick={() => {
                    onToggleView();
                    setOpen(false);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  View Public Profile
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full justify-start gap-2 px-3 font-normal"
                  onClick={handleShareProfileLink}
                >
                  <Link2 className="h-4 w-4" />
                  Share Profile Link
                </Button>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
}
