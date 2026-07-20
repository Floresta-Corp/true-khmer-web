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
import { useIsMobile } from "~/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="mb-2 text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-[40px] dark:text-white">
          {isPublicView ? "Public Profile" : "My Profile"}
        </h1>
        <p className="text-base font-medium text-slate-500 sm:text-lg dark:text-slate-400">
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
                  aria-label="More profile options"
                  className="h-12 w-12 cursor-pointer rounded-xl"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48 p-2 md:w-56">
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
