import { Plus } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function OptionCard({
  title,
  description,
  icon,
  actionText,
  isSelected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-300 sm:gap-4 sm:rounded-[24px] sm:p-8",
        isSelected
          ? "scale-[1.02] border-blue-600 bg-white shadow-xl shadow-blue-500/10"
          : "border-transparent bg-slate-50 hover:bg-slate-100",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg transition-colors sm:h-14 sm:w-14 sm:rounded-[20px] [&>svg]:size-5 sm:[&>svg]:size-7",
          isSelected
            ? "bg-blue-600 shadow-blue-600/20"
            : "bg-blue-500 shadow-blue-500/20",
        )}
      >
        {icon}
      </div>

      <div className="space-y-1 sm:space-y-2">
        <h3 className="text-base font-bold text-slate-900 sm:text-xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-500">{description}</p>
      </div>

      <div className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-bold text-blue-600">
        {actionText} <Plus size={16} strokeWidth={3} />
      </div>
    </button>
  );
}
