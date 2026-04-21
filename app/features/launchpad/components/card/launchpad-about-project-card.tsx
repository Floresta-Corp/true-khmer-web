import { FileText } from "lucide-react";
import SectionInputCard from "~/components/section-input-card";
import { Textarea } from "~/components/ui/textarea";

export default function LaunchpadAboutProjectCard() {
  return (
    <SectionInputCard
      header={{
        title: "About This Project",
        icon: <FileText size={24} className="text-blue-500" />,
        required: true,
      }}
    >
      <Textarea
        placeholder="What are you building, why does it matter, and what problem does it solve?"
        className="bg-gray-50 border-none min-h-23"
      />
    </SectionInputCard>
  );
}
