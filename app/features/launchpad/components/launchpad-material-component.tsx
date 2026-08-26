import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";

interface LaunchpadMaterialComponentProps {
  data: {
    name: string;
  };
  onRemove?: () => void;
}

export default function LaunchpadMaterialComponent({
  data,
  onRemove,
}: LaunchpadMaterialComponentProps) {
  return (
    <div className="flex items-center rounded-lg border border-[#F3F4F6] px-4 py-2">
      <div className="flex-1">{data.name}</div>
      <Button
        variant={"outline"}
        className="cursor-pointer border-none bg-transparent"
        type="button"
        onClick={onRemove}
        aria-label={`Remove file ${data.name}`}
      >
        <Trash size={14} className="text-destructive" />
      </Button>
    </div>
  );
}
