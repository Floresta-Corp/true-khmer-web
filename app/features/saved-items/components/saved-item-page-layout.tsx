import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface SavedItemPageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SavedItemPageLayout({
  children,
  className,
  contentClassName,
}: SavedItemPageLayoutProps) {
  return (
    <div className={cn("min-h-screen w-full", className)}>
      <main className={cn("site-container pt-8 pb-10", contentClassName)}>
        {children}
      </main>
    </div>
  );
}
