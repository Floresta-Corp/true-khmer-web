import { ArrowRight, Download } from "lucide-react";
import { Card } from "~/components/ui/card";
import { convertFileSize } from "~/lib/utils";

const data = [
  {
    id: "file-1",
    name: "Nexus Pitch Deck.pdf",
    size: 4915.2,
  },
  {
    id: "file-2",
    name: "Game Mechanics.pdf",
    size: 2048.5,
  },
];

export default function LaunchpadPresentationCard() {
  return (
    <Card className="p-8 gap-3 flex flex-col">
      <div className="text-lg font-semibold">Presentation</div>
      <div className="flex gap-4">
        {data.map((file) => (
          <div
            key={file.id}
            className="cursor-pointer flex flex-1 border border-[#F3F4F6] p-4 rounded-2xl items-center gap-3.5 transition-all hover:bg-slate-50 active:bg-slate-100"
          >
            <div className="size-10.5 flex items-center bg-white justify-center border border-[#F3F4F6] rounded-lg">
              <Download size={17.5} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-medium">{file.name}</div>
              <div className="text-xs text-[#99A1AF] font-bold">
                {convertFileSize(file.size)}
              </div>
            </div>
            <ArrowRight className="text-[#E5E7EB]" size={17.5} />
          </div>
        ))}
      </div>
    </Card>
  );
}
