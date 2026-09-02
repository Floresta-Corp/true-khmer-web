import {
  Heart,
  Users,
  type LucideProps,
  LayoutGrid,
  GraduationCap,
  Monitor,
  Leaf,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import type { VolunteerCategory } from "~/features/volunteer/types";

interface CategoryCardProps {
  category: VolunteerCategory;
  onClick?: (categoryId: string) => void;
  active?: boolean;
  className?: string;
  displayName?: string;
}

function BuildCategoryIcon({
  icon,
  ...props
}: { icon: string | ReactNode } & Omit<LucideProps, "ref"> &
  React.RefAttributes<SVGSVGElement>) {
  if (typeof icon !== "string") {
    return icon;
  }
  switch (icon) {
    case "BookOpen":
      return <GraduationCap {...props} />;
    case "Globe":
      return <Leaf {...props} />;
    case "Heart":
      return <Heart {...props} />;
    case "Users":
      return <Users {...props} />;
    case "Zap":
      return <Monitor {...props} />;
    default:
      return <LayoutGrid {...props} />;
  }
}

export function CategoryCard({
  category,
  onClick,
  active,
  className,
  displayName,
}: CategoryCardProps) {
  const { iconKey, name, displayOrder } = category;
  return (
    <Button
      onClick={() => onClick?.(category.id)}
      type="button"
      variant="ghost"
      className={cn(
        "inline-flex w-full shrink-0 cursor-pointer justify-start gap-2 rounded-[28px] border border-gray-100 bg-white text-left shadow-none md:w-full md:min-w-0",
        active
          ? "bg-[#2463eb] text-white hover:bg-[#1d56d2] hover:text-gray-50"
          : "hover:bg-gray-50",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center",
          active ? "text-white" : "text-[#2563eb]",
        )}
      >
        <BuildCategoryIcon icon={iconKey} className="size-5 shrink-0" />
      </div>
      <div className="flex flex-col items-start gap-[3.5px]">
        <h3 className="text-sm leading-3.5 font-bold">{name}</h3>
        {/* <p className="text-xs leading-4.5 font-medium text-[#99a1af]">
          {displayOrder} {displayName ? displayName : "roles"}
        </p> */}
      </div>
    </Button>
  );
}
