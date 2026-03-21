import { Share2, EllipsisVertical } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function ForumPostActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl p-2 text-[#99a1af] transition-colors hover:bg-white hover:text-[#4a5565]"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl p-2 text-[#99a1af] transition-colors hover:bg-white hover:text-[#4a5565]"
      >
        <EllipsisVertical className="h-4 w-4" />
      </Button>
    </div>
  );
}
