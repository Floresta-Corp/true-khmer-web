import {
  BookOpen,
  Shapes,
  Globe,
  Heart,
  Users,
  Zap,
  type LucideProps,
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
      return <BookOpen />;
    case "Globe":
      return <Globe {...props} />;
    case "Heart":
      return <Heart {...props} />;
    case "Users":
      return <Users {...props} />;
    case "Zap":
      return <Zap {...props} />;
    default:
      return <Shapes {...props} />;
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
        "border border-gray-100 cursor-pointer h-17 w-52.5 justify-start gap-3.5 rounded-[28px] bg-white px-3.75 py-0 text-left shadow-none hover:bg-white md:w-full md:min-w-0",
        active ? "border-blue-300 bg-blue-50" : "",
        className,
      )}
    >
      <div className="flex size-[38.5px] shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
        <BuildCategoryIcon icon={iconKey} className="size-4" />
      </div>
      <div className="flex flex-col items-start gap-[3.5px]">
        <h3 className="text-sm font-bold leading-3.5 text-[#030213]">{name}</h3>
        <p className="text-xs font-medium leading-4.5 text-[#99a1af]">
          {displayOrder} {displayName ? displayName : "roles"}
        </p>
      </div>
    </Button>
  );
}
