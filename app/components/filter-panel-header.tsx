import { cn } from "~/lib/utils";

interface FilterPanelHeaderProps {
  onClearAll: () => void;
  className?: string;
}

/** "Filters / Clear all" row shared by every search results sidebar. */
export default function FilterPanelHeader({
  onClearAll,
  className,
}: FilterPanelHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-sm font-bold text-[#020618]">Filters</h2>
      <button
        type="button"
        onClick={onClearAll}
        className="group relative cursor-pointer text-xs font-semibold text-[#2463eb] transition-colors hover:text-[#1d4ed8] focus-visible:outline-none"
      >
        Clear all
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-center scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </button>
    </div>
  );
}
