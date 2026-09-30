import { Check, type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const contributionCardBaseClassName =
  "relative h-auto w-full cursor-pointer items-stretch justify-start whitespace-normal rounded-2xl border border-slate-200 bg-white p-4 text-left text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-700 motion-reduce:transition-none";

const contributionCardSelectedClassName =
  "border-blue-300 bg-blue-50 ring-1 ring-inset ring-blue-300/40 hover:border-blue-400 hover:bg-blue-100 hover:text-slate-700 hover:ring-blue-400/60";

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
        contributionCardBaseClassName,
        selected ? contributionCardSelectedClassName : null,
        isFeatured ? "min-h-34.5" : "min-h-40 sm:min-h-47",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border-2 transition-colors motion-reduce:transition-none",
          selected
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-slate-300 bg-white text-transparent group-hover/button:border-slate-400",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <div className="flex h-full w-full flex-col items-start gap-2 pr-6">
        <Icon size={32} className="text-blue-500" />
        <h3 className="text-[16px] leading-7 font-bold text-slate-700">
          {title}
        </h3>
        <p className="text-sm leading-5 font-normal text-slate-500">
          {description}
        </p>
      </div>
    </Button>
  );
}
