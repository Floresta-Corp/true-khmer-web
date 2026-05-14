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
        "flex-1 text-left p-8 rounded-[24px] transition-all duration-300 flex flex-col gap-4 border-2",
        isSelected
          ? "bg-white border-blue-600 shadow-xl shadow-blue-500/10 scale-[1.02]"
          : "bg-slate-50 border-transparent hover:bg-slate-100",
      )}
    >
      <div
        className={cn(
          "w-14 h-14 rounded-[20px] flex items-center justify-center text-white shadow-lg transition-colors",
          isSelected
            ? "bg-blue-600 shadow-blue-600/20"
            : "bg-blue-500 shadow-blue-500/20",
        )}
      >
        {icon}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto pt-2 flex items-center gap-1.5 text-blue-600 font-bold text-sm">
        {actionText} <Plus size={16} strokeWidth={3} />
      </div>
    </button>
  );
}
