import { Trash } from "lucide-react";
import { Button } from "~/components/ui/button";

interface LaunchpadMaterialComponentProps {
  data: {
    name: string;
  };
}

export default function LaunchpadMaterialComponent({
  data,
}: LaunchpadMaterialComponentProps) {
  return (
    <div className="flex items-center border border-[#F3F4F6] rounded-lg px-4 py-2">
      <div className="flex-1">{data.name}</div>
      <Button
        variant={"outline"}
        className="cursor-pointer border-none bg-transparent"
      >
        <Trash size={14} className="text-destructive" />
      </Button>
    </div>
  );
}
