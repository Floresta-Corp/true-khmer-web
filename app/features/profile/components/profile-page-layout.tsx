import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ProfilePageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ProfilePageLayout({
  children,
  className,
  contentClassName,
}: ProfilePageLayoutProps) {
  return (
    <div className={cn("min-h-screen w-full", className)}>
      <main className={cn("site-container pt-8 pb-10", contentClassName)}>
        {children}
      </main>
    </div>
  );
}
