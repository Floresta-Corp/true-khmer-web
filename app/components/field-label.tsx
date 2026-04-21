import { cn } from "~/lib/utils";
import { Label } from "./ui/label";

export default function FieldLabel({
  children,
  className,
  required,
}: {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <Label className={cn("text-sm font-medium text-[#030213]", className)}>
      {children}
      {required ? (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
    </Label>
  );
}
