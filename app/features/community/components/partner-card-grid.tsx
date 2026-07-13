import { Children, type ReactNode } from "react";
import type { PartnerCardVariant } from "./partner-card";

const GRID_CLASSES: Record<PartnerCardVariant, string> = {
  1: "grid w-full grid-cols-1 place-items-center justify-items-center gap-8 sm:grid-cols-1 md:grid-cols-2 md:gap-12 lg:grid-cols-3",
  2: "grid w-full grid-cols-2 justify-items-start gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4",
  3: "grid w-full grid-cols-2 justify-items-start gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5",
  4: "grid w-full grid-cols-3 justify-items-start gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-7",
  5: "grid w-full grid-cols-3 justify-items-start gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-7",
};

interface PartnerCardGridProps {
  children: ReactNode;
  variant: PartnerCardVariant;
}

export function PartnerCardGrid({ children, variant }: PartnerCardGridProps) {
  const count = Children.count(children);

  if (count === 1) {
    return (
      <div className="flex w-full items-start justify-start">{children}</div>
    );
  }

  if (count <= 3 && variant === 1) {
    return (
      <div className="grid w-full grid-cols-1 place-items-center gap-8 sm:grid-cols-1 md:gap-12 lg:flex lg:justify-center">
        {children}
      </div>
    );
  }

  if (count <= 3 && variant === 2) {
    return (
      <div className="flex w-full flex-wrap justify-start gap-4 md:gap-8">
        {children}
      </div>
    );
  }

  if (count <= 4 && variant === 3) {
    return (
      <div className="flex w-full flex-wrap justify-start gap-3 md:gap-6">
        {children}
      </div>
    );
  }

  if (count <= 5 && (variant === 4 || variant === 5)) {
    return (
      <div className="flex w-full flex-wrap justify-start gap-3 md:gap-4">
        {children}
      </div>
    );
  }

  return <div className={GRID_CLASSES[variant]}>{children}</div>;
}
