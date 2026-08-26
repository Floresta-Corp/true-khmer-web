import { FileText } from "lucide-react";
import SectionInputCard from "~/components/section-input-card";
import { Textarea } from "~/components/ui/textarea";

interface LaunchpadAboutProjectCardProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LaunchpadAboutProjectCard({
  value,
  onChange,
}: LaunchpadAboutProjectCardProps) {
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-23 border-none bg-gray-50 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-blue-500/45"
      />
    </SectionInputCard>
  );
}
