import { Paperclip, Plus, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import LaunchpadMaterialComponent from "../launchpad-material-component";
import SectionInputCard from "~/components/section-input-card";

interface LaunchpadProjectMaterialCardProps {
  file: { name: string }[];
}

export default function LaunchpadProjectMaterialCard({
  file,
}: LaunchpadProjectMaterialCardProps) {
  return (
    <SectionInputCard
      header={{
        title: "Project Deck & Materials",
        icon: <Paperclip size={17.5} className="text-blue-500" />,
        required: true,
        action: (
          <Button
            variant="outline"
            className="cursor-pointer h-10 bg-gray-100 hover:bg-gray-200 border-none"
          >
            <Plus /> Add file
          </Button>
        ),
      }}
      hideSeparator
    >
      {file?.map((v) => (
        <LaunchpadMaterialComponent key={v.name} data={v} />
      ))}
    </SectionInputCard>
  );
}
