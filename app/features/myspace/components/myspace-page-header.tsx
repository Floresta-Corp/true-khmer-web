import * as React from "react";
import { useSearchParams } from "react-router";
import { Eye, Link2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function PageHeader() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = React.useState<"myview" | "public">(
    searchParams.get("view") === "public" ? "public" : "myview",
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const searchViewMode =
      searchParams.get("view") === "public" ? "public" : "myview";

    setViewMode(searchViewMode);
  }, [searchParams]);

  const isPublicView = viewMode === "public";

  const handleToggleView = () => {
    const nextViewMode = isPublicView ? "myview" : "public";

    setViewMode(nextViewMode);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (nextViewMode === "public") {
        nextParams.set("view", "public");
      } else {
        nextParams.delete("view");
      }

      return nextParams;
    });
    setOpen(false);
  };

  const handleShareProfileLink = async () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("view", "public");

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
      toast.success("Profile link copied to clipboard.");
    } catch {
      toast.error("Failed to copy profile link.");
    }

    setOpen(false);
  };

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isPublicView ? "Public Profile" : "Profile"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isPublicView
            ? "This is the public view others can see and share."
            : "Manage how you appear to your team and what others see on your public profile."}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-2">
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-full justify-start gap-2 px-3 font-normal"
              onClick={handleToggleView}
            >
              <Eye className="h-4 w-4" />
              {isPublicView ? "View My Profile" : "View Public Profile"}
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
      </div>
    </div>
  );
}
