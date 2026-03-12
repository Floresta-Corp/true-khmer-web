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
        "h-auto w-full cursor-pointer items-stretch justify-start whitespace-normal rounded-2xl p-4 text-left text-[#23324B] shadow-none transform-gpu transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-px hover:text-[#23324B] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] motion-reduce:transform-none motion-reduce:transition-none",
        selected
          ? "border-[#93C5FD] bg-[#EEF5FF] shadow-[inset_0_0_0_1px_rgba(147,197,253,0.35)] hover:border-[#93C5FD] hover:bg-[#EEF5FF] active:bg-[#E4F0FF]"
          : "border-[#D6DFEC] bg-white hover:border-[#B8CCEA] hover:bg-white active:bg-[#F8FAFC]",
        isFeatured ? "min-h-34" : "min-h-42 md:min-h-48",
        className,
      )}
    >
      <div className={cn("flex h-full flex-col", isFeatured ? "gap-2" : "gap-2.5")}>
        <Icon size={26} className="text-[#2894FA]" />
        <h3 className="text-base font-bold leading-7 text-[#23324B]">
          {title}
        </h3>
        <p className="text-sm font-normal leading-5 text-[#5C6E8A]">
          {description}
        </p>
      </div>
    </Button>
  );
}
