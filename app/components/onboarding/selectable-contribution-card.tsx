import { type LucideIcon } from "lucide-react";

type SelectableContributionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
};

export function SelectableContributionCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: SelectableContributionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-48 cursor-pointer rounded-2xl border p-4 text-left transition-colors ${
        selected ? "border-[#9FC4F8] bg-[#EAF2FF]" : "border-[#CBD5E1] bg-white"
      }`}
    >
      <div className="grid h-full grid-rows-[32px_56px_1fr]">
        <div className="flex items-start">
          <Icon size={28} className="text-[#2F6FE4]" />
        </div>
        <h3 className="text-base font-bold leading-7 text-[#334155]">{title}</h3>
        <p className="overflow-hidden text-sm font-normal leading-5 text-[#64748B]">
          {description}
        </p>
      </div>
    </button>
  );
}
