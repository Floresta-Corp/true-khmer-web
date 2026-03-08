import { cn } from "~/lib/utils";

type FormDividerProps = {
  label?: string;
  className?: string;
  lineClassName?: string;
  labelClassName?: string;
};

export function FormDivider({
  label = "Or continue with email",
  className,
  lineClassName,
  labelClassName,
}: FormDividerProps) {
  return (
    <div className={cn("flex items-center gap-3.5", className)}>
      <div className={cn("h-px flex-1 bg-[#E8E8E8]", lineClassName)} />
      <span
        className={cn(
          "text-[10px] font-semibold uppercase tracking-[1px] text-[#99A1AF]",
          labelClassName,
        )}
      >
        {label}
      </span>
      <div className={cn("h-px flex-1 bg-[#E8E8E8]", lineClassName)} />
    </div>
  );
}
