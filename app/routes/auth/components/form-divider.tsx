import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

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
      <Separator
        decorative
        orientation="horizontal"
        className={cn("h-px flex-1 bg-[#E8E8E8]", lineClassName)}
      />
      <span
        className={cn(
          "text-[10px] font-semibold tracking-[1px] text-[#99A1AF] uppercase",
          labelClassName,
        )}
      >
        {label}
      </span>
      <Separator
        decorative
        orientation="horizontal"
        className={cn("h-px flex-1 bg-[#E8E8E8]", lineClassName)}
      />
    </div>
  );
}
