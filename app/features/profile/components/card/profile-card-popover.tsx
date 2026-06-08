import * as React from "react";
import { useParams } from "react-router";
import { EllipsisVertical, Link2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function ProfileCardPopover() {
  const params = useParams();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-11 px-3.5 rounded-full font-bold cursor-pointer"
        >
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <Button
          variant="ghost"
          className="h-10 w-full justify-start gap-2 px-3 font-bold"
        >
          <Plus className="h-4 w-4" />
          Follow
        </Button>
        <Button
          variant="ghost"
          className="h-10 w-full justify-start gap-2 px-3 font-bold"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/profile/${params.id}`,
            );
            toast.success("Share profile success.");
            setOpen(false);
          }}
        >
          <Link2 className="h-4 w-4" />
          Share Profile
        </Button>
      </PopoverContent>
    </Popover>
  );
}
