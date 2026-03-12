import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  roleCount: number;
}

export function CategoryCard({ icon, title, roleCount }: CategoryCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-17 w-[210px] justify-start gap-3.5 rounded-[28px] border border-[#f3f4f6] bg-white px-[15px] py-0 text-left shadow-none hover:bg-white md:w-full md:min-w-0"
    >
      <div className="flex size-[38.5px] shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
        {icon}
      </div>
      <div className="flex flex-col items-start gap-[3.5px]">
        <h3 className="text-sm font-bold leading-3.5 text-[#030213]">
          {title}
        </h3>
        <p className="text-xs font-medium leading-4.5 text-[#99a1af]">
          {roleCount} roles
        </p>
      </div>
    </Button>
  );
}
