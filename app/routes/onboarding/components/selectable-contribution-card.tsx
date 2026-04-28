import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type SelectableContributionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
  layout?: "default" | "featured";
  className?: string;
};

export function SelectableContributionCard({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
  layout = "default",
  className,
}: SelectableContributionCardProps) {
  const isFeatured = layout === "featured";

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "h-auto w-full cursor-pointer items-stretch justify-start whitespace-normal rounded-2xl border border-[#E1E7EF] bg-white p-4 text-left text-[#23324B] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:bg-white hover:text-[#23324B] motion-reduce:transition-none",
        selected
          ? "border-[#93C5FD] bg-[#EEF5FF] shadow-[inset_0_0_0_1px_rgba(147,197,253,0.35)]"
          : "hover:border-[#D6DFEC]",
        isFeatured ? "min-h-34.5" : "min-h-47",
        className,
      )}
    >
      <div className="flex h-full w-full flex-col items-start gap-2">
        <Icon size={32} className="text-[#2894FA]" />
        <h3 className="text-[16px] font-bold leading-7 text-[#344256]">
          {title}
        </h3>
        <p className="text-sm font-normal leading-5 text-[#62748E]">
          {description}
        </p>
      </div>
    </Button>
  );
}
