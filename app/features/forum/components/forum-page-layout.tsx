import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ForumPageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ForumPageLayout({
  children,
  className,
  contentClassName,
}: ForumPageLayoutProps) {
  return (
    <div className={cn("min-h-screen w-full bg-[#f8fafc]", className)}>
      <main className={cn("site-container pt-8 pb-10", contentClassName)}>
        {children}
      </main>
    </div>
  );
}
