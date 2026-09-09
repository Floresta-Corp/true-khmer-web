import { cn } from "~/lib/utils";

export const VISIBILITY_OPTIONS = ["public", "members", "private"] as const;

export type VisibilityOption = (typeof VISIBILITY_OPTIONS)[number];

interface VisibilitySettingCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  value: string;
  onChange: (option: VisibilityOption) => void;
}

/**
 * One row of the Edit Profile visibility panel: a labelled setting with a
 * segmented control for who can see it.
 */
export default function VisibilitySettingCard({
  icon: Icon,
  label,
  description,
  value,
  onChange,
}: VisibilitySettingCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-gray-400" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        </div>
      </div>

      {/* Segmented control: one grey track, the selection lifted out in white. */}
      <div
        role="radiogroup"
        aria-label={`${label} visibility`}
        className="mt-4 flex gap-1 rounded-xl bg-gray-100 p-1"
      >
        {VISIBILITY_OPTIONS.map((option) => {
          const isActive = value === option;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option)}
              className={cn(
                "flex-1 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-colors",
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
