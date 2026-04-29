import { ArrowRight, Download } from "lucide-react";
import { Card } from "~/components/ui/card";
import { resolveImageURL } from "~/lib/utils";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";

interface LaunchpadPresentationCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadPresentationCard({
  project,
}: LaunchpadPresentationCardProps) {
  const documentData = project.documentKeys.map((key, index) => ({
    id: `file-${index}`,
    key,
    name: key.split("/").pop() || `Document ${index + 1}`,
    sizeLabel: "PDF",
  }));

  if (documentData.length === 0) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-4 rounded-2xl border-[#E7ECF3] bg-white p-6">
      <div className="text-xl font-semibold text-[#0F1729]">Presentation</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {documentData.map((file) => (
          <a
            key={file.id}
            href={resolveImageURL(file.key)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-[#E7ECF3] p-3 transition-all hover:bg-slate-50"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white">
              <Download size={16} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="line-clamp-1 text-sm font-medium text-[#0F1729]">
                {file.name}
              </div>
              <div className="text-xs font-semibold text-[#99A1AF]">
                {file.sizeLabel}
              </div>
            </div>
            <ArrowRight className="text-[#D1D5DC]" size={16} />
          </a>
        ))}
      </div>
    </Card>
  );
}
